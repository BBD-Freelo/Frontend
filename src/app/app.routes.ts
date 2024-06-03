import { Routes } from '@angular/router';
import { BoardComponent } from './pages/board/board.component';
import { HomeComponent } from "./pages/home/home.component";
import { authGuard } from './auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'board/:board', component: BoardComponent, canActivate: [authGuard] },
  { path: 'confirm-signup', component: ConfirmSignupComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' }
];
