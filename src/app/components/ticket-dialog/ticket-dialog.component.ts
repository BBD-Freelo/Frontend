import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { TicketData } from '../../interfaces/components/ticketData';
import { MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Ticket } from '../../interfaces/entities/ticket';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-ticket-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatInputModule,
    MatFormField,
    MatButton,
    MatIcon,
    MatIconButton,
    FormsModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.css'
})
export class TicketDialogComponent {
  descriptionEdit: boolean = false;
  valueFormControl = new FormControl('', [Validators.maxLength(500)]);

  constructor(
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TicketData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveDescription(): void {
    if (this.valueFormControl.invalid) return;
  }

  openDeleteDialog(ticket: TicketData): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {name: ticket.title, id: ticket.id},
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
