import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MyBoards } from '../../interfaces/entities/myBoard';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { 
  MatDialog,
 } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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
  boards: MyBoards[] = [];

  constructor(private apiService: ApiService, private router: Router, public dialog: MatDialog) {
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

  // This may need some TLC not sure if this is the best way to do this
  // I accually think this is the best way is to use nested routing with the nav being the parent 
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
        // this.apiService.delete(`/board/${board.boardId}`).subscribe(() => {
        //   this.boards = this.boards.filter((b) => b.boardId !== board.boardId);
        // });
      }
    });
  }
} 
