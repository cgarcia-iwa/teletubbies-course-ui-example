import { type HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ProblemDetail } from '../../shared/model/problem-detail.model';
import { NotificationService } from '../services/notification.service';
import { DEFAULT_HTTP_ERROR, HTTP_ERRORS } from './http-error-messages';

/**
 * Muestra un toast por cada error HTTP y relanza el error, para que el componente
 * solo restablezca su estado (p. ej. `isSubmitting`) sin repetir el manejo del mensaje.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const { title, message } = HTTP_ERRORS[error.status] ?? DEFAULT_HTTP_ERROR;
      notify.error(title, getProblemMessage(error) ?? message);
      return throwError(() => error);
    })
  );
};

/** Arma el mensaje a partir del `ProblemDetail` del backend, si la respuesta lo trae. */
const getProblemMessage = (error: HttpErrorResponse): string | null => {
  const problem = error.error as Partial<ProblemDetail> | null;
  if (!problem || typeof problem !== 'object') {
    return null;
  }

  const fieldErrors = problem.errors?.map(({ field, message }) => `${field}: ${message}`) ?? [];
  if (fieldErrors.length > 0) {
    return fieldErrors.join(' · ');
  }

  return problem.detail || null;
};
