import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { addList } from '../../interfaces/entities/addList';
import { ApiService } from '../../services/api.service';
import {AddListResponse} from "../../interfaces/Responses/addList";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';


@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [
    FormsModule, MatIcon, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatLabel, MatInputModule
  ],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css'
})
export class AddListComponent {
  @Output() newList = new EventEmitter<AddListResponse>();
  @Input({required: true}) boardId!: number;
  valueFormControl = new FormControl('', [Validators.required, Validators.maxLength(15), Validators.minLength(1), Validators.pattern('[a-zA-Z0-9 ]*')]);

  constructor(private apiService: ApiService) {}

  addNewList() {
    if (this.valueFormControl.invalid) return;

    const newBoard: addList = {
      listName: this.valueFormControl.value!,
      boardId: this.boardId
    }
    this.valueFormControl.reset();
    this.apiService.post<AddListResponse,addList>('/list/new', newBoard).subscribe((item) => {
      this.newList.emit(item);
    });
  }
}
