import { Routes } from '@angular/router';
import { BoardComponent } from './pages/board/board.component';
import { HomeComponent } from "./pages/home/home.component";
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'board/:board',
    loadComponent: () =>
      import('./pages/board/board.component').then(m => m.BoardComponent),
    canActivate: [authGuard]
  }
];
