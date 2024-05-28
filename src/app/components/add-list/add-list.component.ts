import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { addList } from '../../interfaces/entities/addList';
import { ApiService } from '../../services/api.service';
import { List } from '../../interfaces/entities/list';

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
  @Output() newList = new EventEmitter<string>();
  @Input({required: true}) boardId!: number;
  @Input({required: true}) reloadCallback!: Function;
  listName: string = '';

  constructor(private apiService: ApiService) {}

  addNewList() {
    console.log('Adding new list:', this.listName);
    const newBoard: addList = {
      listName: this.listName,
      boardId: this.boardId
    }
    this.apiService.post<List,unknown>('/list/new', newBoard).subscribe((item) => {
      this.reloadCallback(item);
    });
  }
}
