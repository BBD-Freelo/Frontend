import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {TicketData} from '../../interfaces/components/ticketData';
import {MatFormField, MatInputModule} from '@angular/material/input';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RemoveTicketResponse, UpdateTicketResponse} from '../../interfaces/Responses/ticketResponse';
import {MatOption, MatSelect} from '@angular/material/select';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {AuthService} from '../../services/auth.service';

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
    MatSelect,
    MatOption,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './ticket-dialog.component.html',
  styleUrl: './ticket-dialog.component.css'
})
export class TicketDialogComponent {

  editMode: boolean = false;

  datepicker: Date = new Date();
  dateHolder!: string;
  assignedId: number | undefined = undefined;
  formGroup = new FormGroup({
    descriptionControl: new FormControl('', [Validators.maxLength(500), Validators.pattern("^[a-zA-Z0-9.,?!/ ]*$")]),
  })
  profileUrl: string = '';


  constructor(
    public dialogRef: MatDialogRef<TicketDialogComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: TicketData,
    private authService: AuthService
  ) {
    this.getProfileUrl();
  }


  async getProfileUrl() {
    this.profileUrl = await this.authService.getProfileUrl();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  update(): void {
    if (this.formGroup.controls.descriptionControl.invalid) return;
    const UpdateTicketResponse: UpdateTicketResponse = {
      isEdit: true,
      ticketId: this.data.id,
      ticketDescription: this.formGroup.controls.descriptionControl.value || this.data.description,
      ticketDueDate: this.dateHolder || new Date(this.data.due),
      ticketName: this.data.title,
      assignedUser: this.assignedId || this.data.assigned?.userId,
    };
    this.dialogRef.close(UpdateTicketResponse);
  }

  openDeleteDialog(ticketId: number): void
  {
    let RemoveTicketResponse: RemoveTicketResponse = {
      isEdit: false,
      ticketId: ticketId,
    };

    this.dialogRef.close(RemoveTicketResponse);
  }

  dateChanged(event: MatDatepickerInputEvent<Date>) {
    if(event.value) {
      // Because fuck date time
      this.dateHolder = `${event.value.getFullYear()}-${String(event.value.getMonth() + 1).padStart(2, '0')}-${String(event.value.getDate()).padStart(2, '0')}`;
    }
  }
}
