import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'board/:board',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'confirm-signup',
    loadComponent: () =>
      import('./components/confirm-signup/confirm-signup.component').then(m => m.ConfirmSignupComponent)
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./components/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
];
