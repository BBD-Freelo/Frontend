import {Component, Input} from '@angular/core';
import {
  CdkDrag,
} from '@angular/cdk/drag-drop';
import { Ticket } from "../../interfaces/entities/ticket";
import { MatDialog } from '@angular/material/dialog';
import { TicketDialogComponent } from '../ticket-dialog/ticket-dialog.component';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CdkDrag],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class ticketComponent {
  @Input({required: true}) ticket!: Ticket;

  constructor(private dialog: MatDialog) {}

  convertDate(date: Date): string {
    return date ? new Date(date).toISOString().split('T')[0] : '--';
  }
  

  openDialog(): void {
    const data = {
      id: this.ticket.ticketId,
      title: this.ticket.ticketName,
      description: this.ticket.ticketDescription || 'No description',
      created: this.convertDate(this.ticket.ticketCreateDate),
      updated:  this.convertDate(this.ticket.ticketUpdateDate),
      due: this.convertDate(this.ticket.ticketDueDate),
      assigned: this.ticket.assignedUser,
    }
    const dialogRef = this.dialog.open(TicketDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.apiService.delete(`/board/${board.boardId}`).subscribe(() => {
        //   this.boards = this.boards.filter((b) => b.boardId !== board.boardId);
        // });
      }
    });
  }
}
