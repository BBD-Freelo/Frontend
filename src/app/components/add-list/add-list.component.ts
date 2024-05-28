import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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
  listName: string = '';

  addList() {
    if (this.listName.trim()) {
      this.newList.emit(this.listName);
      this.listName = '';
    }
  }
}
