import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Board } from '../../interfaces/entities/board';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { BoardComponent } from '../../components/board/board.component';
import { HeaderComponent } from '../../components/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ErrorViewComponent } from '../../components/error-view/error-view.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    BoardComponent,
    HeaderComponent,
    MatSidenavModule,
    NavbarComponent,
    ErrorViewComponent,
    MatProgressSpinner,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  currentBoardId!: number;
  board!: Board;
  found = false;
  error = false;
  home = true;
  
  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    this.route.params.subscribe( params => this.currentBoardId = params["board"] );

    if (this.currentBoardId != 0) {
      this.loadBoard(this.currentBoardId);
    }
    else {
      this.found = true;
      this.home = true;
    }
  }

  loadBoard(boardId: number) {
    this.apiService.get<Board>(`/board/${boardId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.error = true;
        return of(null);
      })
    ).subscribe((data) => {
      if (data !== null) {
        this.board = data;
        this.found = true;
        this.home = false;
      }
    });
  }

}
