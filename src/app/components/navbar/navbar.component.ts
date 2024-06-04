import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MyBoards } from '../../interfaces/entities/myBoard';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { 
  MatDialog,
 } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { BoardDialogComponent } from '../add-board/board-dialog.component';
import { AddBoard } from '../../interfaces/components/addBoard';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() newBoard = new EventEmitter<AddBoard>();
  boards: MyBoards[] = [];
  currentBoardId!: number;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router, public dialog: MatDialog) {
    this.route.params.subscribe( params => this.currentBoardId = params["board"] );
    this.loadBoards();
  }

  loadBoards() {
    this.apiService.get<MyBoards[] >(`/board`)
    .subscribe((data) => {
      if (data !== null) {
        this.boards = data;
      }
    });
  }

  navigateToBoard(boardId: number) {
    this.router.navigateByUrl('/', {skipLocationChange: true})
      .then(()=>this.router.navigate(['board',boardId.toString()]));
  }

  openDeleteDialog(board: MyBoards): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {name: board.boardName, id: board.boardId},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.delete(`/board/remove/${board.boardId}`).subscribe(() => {
          this.boards = this.boards.filter((b) => b.boardId !== board.boardId);
        });
      }
    });
  }

  openBoardDialogue(): void {
    const data: AddBoard = {
      boardCollaborators: [],
      boardName: null,
      isPublic: false
    }
    const dialogRef = this.dialog.open(BoardDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const updateRes = result as AddBoard;
        console.log(result.boardCollaborators);
        
        this.newBoard.emit(updateRes);

        this.apiService.post(`/board/new`, updateRes).subscribe((data) => {
          this.boards.push(data as MyBoards);
        });
      }

    });
  }
} 
