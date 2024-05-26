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
import {AddTicketComponent} from "../../components/add-item/add-ticket.component";
import {AddTicket} from "../../interfaces/components/addTicket";

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, ticketComponent, AddListComponent, AddTicketComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board!: List[];
  currentBoard!: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.route.params.subscribe( params => this.currentBoard = params["board"] );
    this.apiService.get<List[]>(`/board/${this.currentBoard}`).subscribe((data) => {
      this.board = data;
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
    return this.board
      .filter((list: { id: number; }) => list.id !== listName)
      .map((list: { id: { toString: () => any; }; }) => list.id.toString());
  }

  addNewList(listName: string) {
    console.log('Adding new list:', listName);
    const newBoard: List = {
      id: this.board.length + 1, // Id has to be added temporarily, we should probably generate a random hash or a number that won't be in our db
      name: listName,
      tickets: []
    }
    this.board.push(newBoard);

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
    const list = this.board.find(list => list.id === listId);

    if (list) {
      const newTicketId = list.tickets.length > 0 ? Math.max(...list.tickets.map(ticket => ticket.id)) + 1 : 1;

      const newTicket = {
        id: newTicketId,
        name: ticketTitle
      };

      list.tickets.push(newTicket);
    } else {
      console.error(`List with ID ${listId} not found.`);
    }
  }
}
