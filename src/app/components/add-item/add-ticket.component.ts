import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddTicket } from "../../interfaces/components/addTicket";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AddTicketResponse} from "../../interfaces/Responses/addTicket";
import {ApiService} from "../../services/api.service";

@Component({
  selector: 'app-add-ticket',
  standalone: true,
  imports: [
    FormsModule, MatButtonModule,MatIcon
  ],
  templateUrl: './add-ticket.component.html',
  styleUrl: './add-ticket.component.css'
})
export class AddTicketComponent {
  @Output() newTicket = new EventEmitter<AddTicketResponse>();
  @Input({required: true}) listId!: number;
  ticketTitle: string = '';

  constructor(private apiService: ApiService) {}

  addItem() {
    const newTicket: AddTicket = {
      ticketName: this.ticketTitle,
      listId: this.listId
    }
    this.ticketTitle = '';
    this.apiService.post<AddTicketResponse, AddTicket>('/ticket/add', newTicket).subscribe((ticket) => {
      this.newTicket.emit(ticket);
    });
  }
}
