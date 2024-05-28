import { Routes } from '@angular/router';
import { BoardComponent } from './pages/board/board.component';
import { HomeComponent } from "./pages/home/home.component";
import { authGuard } from './auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';

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
  },
  { path: 'confirm-signup', component: ConfirmSignupComponent },
  { path: 'signup', component: SignupComponent },
];
