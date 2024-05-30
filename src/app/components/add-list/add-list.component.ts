import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { addList } from '../../interfaces/entities/addList';
import { ApiService } from '../../services/api.service';
import { List } from '../../interfaces/entities/list';
import {AddListResponse} from "../../interfaces/Responses/addList";

@Component({
  selector: 'app-add-list',
  standalone: true,
  imports: [
    FormsModule, MatIcon, MatButtonModule
  ],
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.css'
})
export class AddListComponent {
  @Output() newList = new EventEmitter<AddListResponse>();
  @Input({required: true}) boardId!: number;
  listName: string = '';

  constructor(private apiService: ApiService) {}

  addNewList() {
    this.listName = '';
    const newBoard: addList = {
      listName: this.listName,
      boardId: this.boardId
    }
    this.apiService.post<AddListResponse,addList>('/list/new', newBoard).subscribe((item) => {
      this.newList.emit(item);
    });
  }
}
