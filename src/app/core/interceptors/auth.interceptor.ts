import {
  type HttpErrorResponse,
  type HttpInterceptorFn,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Agrega Authorization: Bearer <token> a cada request saliente, si hay sesión.
 * Si el backend responde 401 (token caducado/rechazado), cierra la sesión y redirige a /login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const authReq = authService.isAuthenticated()
    ? req.clone({ setHeaders: { Authorization: `Bearer ${authService.getToken()}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        authService.logout();
        router.navigateByUrl('/login');
      }
      return throwError(() => error);
    })
  );
};
