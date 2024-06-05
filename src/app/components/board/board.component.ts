import { Component, Input } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { ticketComponent } from '../ticket/ticket.component';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api.service';
import { Ticket } from '../../interfaces/entities/ticket';
import { AddListComponent } from '../add-list/add-list.component';
import { AddTicketComponent } from "../add-item/add-ticket.component";
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Board } from '../../interfaces/entities/board';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {AddListResponse} from "../../interfaces/Responses/addList";
import {AddTicketResponse} from "../../interfaces/Responses/addTicket";
import {MoveTicketRequest} from "../../interfaces/Requests/moveTicket";
import {SuccesResponse} from "../../interfaces/Responses/success";
import { List } from '../../interfaces/entities/list';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { RemoveTicketResponse, UpdateTicketResponse } from '../../interfaces/Responses/ticketResponse';
import { ErrorViewComponent } from '../error-view/error-view.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    ticketComponent,
    ErrorViewComponent,
    AddListComponent,
    MatProgressSpinner,
    AddTicketComponent,
    MatButtonModule,
    MatIcon],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  @Input({required: true}) board!: Board;
  currentBoard!: number;
  found = false;
  error = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService, public dialog: MatDialog) {
    this.route.params.subscribe(params => this.currentBoard = params["board"]);
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
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
        user: ticket.user,
        assignedUser: ticket.assignedUser,
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
      this.apiService.delete(`/ticket/${res.ticketId}`).subscribe(() => {
        this.board.lists.forEach(list => {
          list.tickets = list.tickets.filter(ticket => ticket.ticketId !== res.ticketId);
        });
      });
    }
  }

  updateTicket(res: UpdateTicketResponse) {
    if (res) {
      this.apiService.patch<Ticket, unknown>(`/ticket`, res).subscribe((updatedTicket: Ticket) => {
        const boardList = this.board.lists.find(list => {
          return list.tickets.some(ticket => ticket.ticketId === updatedTicket.ticketId);
        });

        if (boardList) {
          const index = boardList.tickets.findIndex(ticket => ticket.ticketId === updatedTicket.ticketId);
          if (index !== -1) {
            boardList.tickets[index].assignedUser = updatedTicket.assignedUser;
            boardList.tickets[index].ticketDescription = updatedTicket.ticketDescription;
            boardList.tickets[index].ticketDueDate = updatedTicket.ticketDueDate;
            boardList.tickets[index].ticketUpdateDate = updatedTicket.ticketUpdateDate;
          }
        }
      });
    }
  }

  openDeleteDialog(list: List): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {name: list.listName, id: list.listId},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.delete(`/list/${list.listId}`).subscribe(() => {
          this.board.lists = this.board.lists.filter((l) => l.listId !== list.listId);
        });
      }
    });
  }

  addNewList(event: AddListResponse) {
    this.board.lists.push({
      listId: event.listId,
      listName: event.listName,
      tickets: []
    })
  }
}
