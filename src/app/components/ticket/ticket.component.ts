import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { Ticket } from "../../interfaces/entities/ticket";
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';
import { RemoveTicketResponse, UpdateTicketResponse } from '../../interfaces/Responses/ticketResponse';
import { User } from '../../interfaces/entities/user';
import { ApiService } from '../../services/api.service';
import { TicketData } from '../../interfaces/components/ticketData';


@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CdkDrag],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class ticketComponent {
  @Output() removeTicket = new EventEmitter<RemoveTicketResponse>();
  @Output() updateTicket = new EventEmitter<UpdateTicketResponse>();
  @Input({required: true}) ticket!: Ticket;
  @Input({required: true}) collaborators!: User[];

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  convertDate(date: Date): string {
    return date ? new Date(date).toISOString().split('T')[0] : '--';
  }

  openDialog(): void {
    const data: TicketData = {
      id: this.ticket.ticketId,
      title: this.ticket.ticketName,
      description: this.ticket.ticketDescription || 'No description',
      created: this.convertDate(this.ticket.ticketCreateDate),
      updated:  this.convertDate(this.ticket.ticketUpdateDate),
      due: this.convertDate(this.ticket.ticketDueDate),
      assigned: this.ticket.assignedUser!,
      collaborators: this.collaborators,
    }
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      
      if (result.isEdit) {
        const updateRes = result as UpdateTicketResponse;
        this.updateTicket.emit(updateRes);
      }
      else {
        const removeRes = result as RemoveTicketResponse;
        this.removeTicket.emit(removeRes);
      }
    });
  }
}
