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
import { AddTicket } from "../../interfaces/components/addTicket";
import { User } from "../../interfaces/entities/user";
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { HeaderComponent } from '../../components/header/header.component';
import { Board } from '../../interfaces/entities/board';
import { Router } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NavbarComponent  } from '../../components/navbar/navbar.component';

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
  loading = true;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {
    this.route.params.subscribe( params => this.currentBoard = params["board"] );

    this.loadBoard(this.currentBoard);
  }

  // This still needs to be implemented
  // This should add a new list to the board.lists array
  // The list should come from the AddListComponent after it is returned form the post
  addNewList(){

  }

  loadBoard(boardId: number) {
    this.apiService.get<Board >(`/board/${boardId}`).pipe(
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
        this.loading = false;
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
