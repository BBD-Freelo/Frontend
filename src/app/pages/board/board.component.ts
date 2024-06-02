import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ticketComponent } from '../../components/ticket/ticket.component';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api.service';
import { Ticket } from '../../interfaces/entities/ticket';
import { AddListComponent } from '../../components/add-list/add-list.component';
import { AddTicketComponent } from "../../components/add-item/add-ticket.component";
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HeaderComponent } from '../../components/header/header.component';
import { Board } from '../../interfaces/entities/board';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NavbarComponent  } from '../../components/navbar/navbar.component';
import {AddListResponse} from "../../interfaces/Responses/addList";
import {AddTicketResponse} from "../../interfaces/Responses/addTicket";
import {MoveTicketRequest} from "../../interfaces/Requests/moveTicket";
import {SuccesResponse} from "../../interfaces/Responses/success";
import { List } from '../../interfaces/entities/list';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';
import { RemoveTicketResponse } from '../../interfaces/Responses/removeTicket';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    ticketComponent,
    NavbarComponent,
    AddListComponent,
    MatProgressSpinner,
    HeaderComponent,
    AddTicketComponent,
    MatSidenavModule,
    MatButtonModule,
    MatIcon],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board!: Board;
  currentBoard!: number;
  found = false;
  error = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public dialog: MatDialog) {
    this.route.params.subscribe( params => this.currentBoard = params["board"] );

    this.loadBoard(this.currentBoard);
  }

  loadBoard(boardId: number) {
    this.apiService.get<Board >(`/board/${boardId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.error = true;
        return of(null);
      })
    ).subscribe((data) => {
      if (data !== null) {
        this.found = true;
        this.board = data;
      }
    });
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // console.log(event.previousContainer.data[event.previousIndex]);
      // console.log('Current List ID:', event.container.id);
      // console.log('Previous List ID:', event.previousContainer.id);
      const req: MoveTicketRequest = {
        moveToListId: Number(event.container.id),
        ticketId: event.previousContainer.data[event.previousIndex].ticketId
      }
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      )
      this.apiService.patch<SuccesResponse, MoveTicketRequest>('/ticket/move', req).subscribe((data) => {
        if (data.code !== 200) {
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex,
          )
        }
      });
    }
  }

  getConnectedLists(listName: number): string[] {
    return this.board.lists
      .filter((list: { listId: number; }) => list.listId !== listName)
      .map((list: { listId: { toString: () => string; }; }) => list.listId.toString());
  }

  addNewTicket(ticket: AddTicketResponse) {
    const list = this.board.lists.find(list => list.listId === ticket.listId);

    if (list) {

      const newTicket: Ticket = {
        ticketId: ticket.ticketId,
        user: {
          userId: 3,
          userProfilePicture: "sdfjs"
        },
        assignedUser: null,
        ticketName: ticket.ticketName,
        ticketDescription: ticket.ticketDescription,
        ticketCreateDate: ticket.ticketCreateDate,
        ticketUpdateDate: ticket.ticketUpdateDate,
        ticketDueDate: ticket.ticketDueDate
      };
      list.tickets.push(newTicket);
    } else {
      console.error(`List with ID ${ticket.listId} not found.`);
    }
  }

  removeTicket(res: RemoveTicketResponse) {
    if (res) {
      this.apiService.delete(`/ticket/remove/${res.ticketId}`).subscribe(() => {
        this.board.lists.forEach(list => {
          list.tickets = list.tickets.filter(ticket => ticket.ticketId !== res.ticketId);
        });
      });
    }
  }

  openDeleteDialog(list: List): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {name: list.listName, id: list.listId},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.delete(`/list/remove/${list.listId}`).subscribe(() => {
          this.board.lists = this.board.lists.filter((l) => l.listId !== list.listId);
        });
      }
    });
  }

  handleNewList(event: AddListResponse) {
    this.board.lists.push({
      listId: event.listId,
      listName: event.listName,
      tickets: []
    })
  }
}
