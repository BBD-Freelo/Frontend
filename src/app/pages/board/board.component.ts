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
import { List } from '../../interfaces/entities/list';
import { Ticket } from '../../interfaces/entities/ticket';
import { AddListComponent } from '../../components/add-list/add-list.component';
import { AddTicketComponent } from "../../components/add-item/add-ticket.component";
import { AddTicket } from "../../interfaces/components/addTicket";
import { User } from "../../interfaces/entities/user";
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatList } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HeaderComponent } from '../../header/header.component';
import { Board } from '../../interfaces/entities/board';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, ticketComponent, AddListComponent, HeaderComponent, AddTicketComponent, MatSidenavModule, MatList, MatListItem, MatButtonModule, MatIcon],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board!: Board;
  currentBoard!: string;
  boards: Board[] = [];
  found = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.route.params.subscribe( params => this.currentBoard = params["board"] );
    this.apiService.get<Board >(`/board/${this.currentBoard}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(null);
        } else {
          return of(null);
        }
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
      console.log(event.container.data[event.previousIndex]);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event.previousContainer.data[event.previousIndex]);
      console.log('Current List ID:', event.container.id);
      console.log('Previous List ID:', event.previousContainer.id);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  getConnectedLists(listName: number): string[] {
    return this.board.lists
      .filter((list: { listId: number; }) => list.listId !== listName)
      .map((list: { listId: { toString: () => string; }; }) => list.listId.toString());
  }

  addNewList(listName: string) {
    console.log('Adding new list:', listName);
    const newBoard: List = {
      listId: this.board.lists.length + 1, // Id has to be added temporarily, we should probably generate a random hash or a number that won't be in our db
      listName: listName,
      tickets: []
    }
    this.board.lists.push(newBoard);

    // Once we have made lets get the id of "newBoard" delete it from the list and add the value returned by the api call
    // Maybe we just need to return the id of the new list?
    // so
    // this.apiService.post<List>('/board', newBoard).subscribe((data) => {
    //  this.board = this.board.filter((list) => list.id !== newBoard.id);
    //  this.board.push(data);
    // This could potentially be as simple ass returning the boards id then replacing it
    // })

  }

  addNewTicket(ticket: AddTicket) {
    const { ticketTitle, listId } = ticket;
    const list = this.board.lists.find(list => list.listId === listId);

    if (list) {
      const newTicketId = list.tickets.length > 0 ? Math.max(...list.tickets.map(ticket => ticket.ticketId)) + 1 : 1;

      const newTicket: Ticket = {
        ticketId: newTicketId,
        user: {
          userId: -999,
          userProfilePicture: "sdfjs"
        },
        assignedUser: null,
        ticketName: ticketTitle,
        ticketDescription: "SDFsd",
        ticketCreateDate: "today",
        ticketDueDate: "now"
      };
      list.tickets.push(newTicket);
    } else {
      console.error(`List with ID ${listId} not found.`);
    }
  }
}
