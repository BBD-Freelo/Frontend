import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { SignupComponent } from './components/signup/signup.component';
import { ConfirmSignupComponent } from './components/confirm-signup/confirm-signup.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'board/:board',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  { path: 'confirm-signup', component: ConfirmSignupComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
];
