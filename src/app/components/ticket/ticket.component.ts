import {Component, Input} from '@angular/core';
import {
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { Ticket } from "../../interfaces/entities/ticket";

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CdkDrag],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class ticketComponent {
  @Input({required: true}) ticket!: Ticket;
}
