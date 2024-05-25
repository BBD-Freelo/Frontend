import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { CardComponent } from '../../components/card/card.component';
import { ActivatedRoute } from "@angular/router";
import { ApiService } from '../../services/api.service';
import { list } from '../../interfaces/entities/list';
import { item } from '../../interfaces/entities/item';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  board!: list[];
  currentBoard!: string;
  // board = [
  //   {
  //     id: 1,
  //     name: "todo",
  //     items: [
  //       { id: 1, name: "Get to work" },
  //       { id: 2, name: "Pick up groceries" },
  //       { id: 3, name: "Go home" },
  //       { id: 4, name: "Fall asleep" }
  //     ]
  //   },
  //   {
  //     id: 2,
  //     name: "busy",
  //     items: [
  //       { id: 5, name: "Get up" },
  //       { id: 6, name: "Brush teeth" },
  //       { id: 7, name: "Take a shower" },
  //       { id: 8, name: "Check e-mail" },
  //       { id: 9, name: "Walk dog" }
  //     ]
  //   },
  //   {
  //     id: 3,
  //     name: "done",
  //     items: [
  //       { id: 10, name: "grad stuff" }
  //     ]
  //   },
  //   {
  //     id: 4,
  //     name: "backlog",
  //     items: [
  //       { id: 11, name: "db versioning" }
  //     ]
  //   }
  // ];

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.route.params.subscribe( params => this.currentBoard = params["board"] );
    this.apiService.get<list[]>(`/board/${this.currentBoard}`).subscribe((data) => {
      this.board = data;
    });
  }

  drop(event: CdkDragDrop<item[]>) {
    if (event.previousContainer === event.container) {
      console.log(event.container.data[event.previousIndex]);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      console.log(event.previousContainer.data[event.previousIndex]);
      console.log('Current List ID:', event.container.id);
      console.log('Previous List ID:', event.previousContainer.id);
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  getConnectedLists(listName: number): string[] {
    return this.board
      .filter((list: { id: number; }) => list.id !== listName)
      .map((list: { id: { toString: () => any; }; }) => list.id.toString());
  }
}
