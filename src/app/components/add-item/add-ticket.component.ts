import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AddTicket } from "../../interfaces/components/addTicket";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButtonModule} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {AddTicketResponse} from "../../interfaces/Responses/addTicket";
import {ApiService} from "../../services/api.service";
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-add-ticket',
  standalone: true,
  imports: [
    FormsModule, MatButtonModule, MatIcon, MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule
  ],
  templateUrl: './add-ticket.component.html',
  styleUrl: './add-ticket.component.css'
})
export class AddTicketComponent {
  @Output() newTicket = new EventEmitter<AddTicketResponse>();
  @Input({required: true}) listId!: number;
  valueFormControl = new FormControl('', [Validators.required, Validators.maxLength(20), Validators.minLength(1), Validators.pattern('[a-zA-Z0-9 ]*')]);

  constructor(private apiService: ApiService) {}

  addNewTicket() {
    if (this.valueFormControl.invalid) return;

    const newTicket: AddTicket = {
      ticketName: this.valueFormControl.value!,
      listId: this.listId
    }
    this.apiService.post<AddTicketResponse, AddTicket>('/ticket/add', newTicket).subscribe((ticket) => {
      this.newTicket.emit(ticket);
    });
  }
}
