import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import {AuthService} from "../services/auth.service";
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';


export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return authService.getUserAccessToken().pipe(
    switchMap(authToken => {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`
        }
      });
      return next(authReq);
    }),
    catchError(error => {
      console.error('Error in request interceptor:', error);
      return throwError(() => error);
    })
  );
};
