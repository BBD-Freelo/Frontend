import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { MyBoards } from '../../interfaces/entities/myBoard';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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

  constructor(private apiService: ApiService, private router: Router) {
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

}
