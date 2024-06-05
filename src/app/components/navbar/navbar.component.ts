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
import { EditBoardDialogComponent } from '../edit-board/edit-board-dialog.component';

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

  loadCollaborators(board: MyBoards) {
    this.apiService.get<string[]>(`/user/collaborators/${board.boardId}`)
    .subscribe((data) => {
      if (data !== null) {
        board.boardCollaborators = data;
      }
    });
  }

  // This may need some TLC not sure if this is the best way to do this
  // I accually think this is the best way is to use nested routing with the nav being the parent

  navigateToBoard(boardId: number) {
    const board = this.boards.find((b) => b.boardId === boardId);
    if (board) {
      console.log(board);

      this.loadCollaborators(board);
      this.router.navigateByUrl('/', {skipLocationChange: true})
        .then(()=>this.router.navigate(['board',boardId.toString()]));
    }
  }

  openDeleteDialog(board: MyBoards): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {name: board.boardName, id: board.boardId, boardCollaborators: board.boardCollaborators},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.delete(`/board/remove/${board.boardId}`).subscribe(() => {
          this.boards = this.boards.filter((b) => b.boardId !== board.boardId);
        });
      }
    });
  }

  openEditDialog(board: MyBoards): void {
    const data: AddBoard = {
      boardId: board.boardId,
      boardCollaborators: board.boardCollaborators,
      boardName: board.boardName,
      isPublic: false
    }
    const dialogRef = this.dialog.open(EditBoardDialogComponent, {
      data: data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        const updateRes: AddBoard = result;
        this.apiService.patch<MyBoards,AddBoard>(`/board/edit`, updateRes).subscribe((data) => {
          this.boards = this.boards.map((b) => {
            if (b.boardId === data.boardId) {
              return {
                boardId: data.boardId,
                boardName: data.boardName,
                boardCollaborators: data.boardCollaborators
              }
            }
            return b;
          })
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

        this.newBoard.emit(updateRes);

        this.apiService.post(`/board/new`, updateRes).subscribe((data) => {
          this.boards.push(data as MyBoards);
        });
      }

    });
  }
}
