import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddTicket } from "../../interfaces/components/addTicket";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

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
  @Output() newTicket = new EventEmitter<AddTicket>();
  @Input({required: true}) listId!: number;
  ticketTitle: string = '';

  addItem() {
    if (this.ticketTitle.trim()) {
      this.newTicket.emit({
        ticketTitle: this.ticketTitle,
        listId: this.listId
      });
      this.ticketTitle = '';
    }
  }
}
