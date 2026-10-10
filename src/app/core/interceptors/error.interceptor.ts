import {
  type HttpErrorResponse,
  type HttpInterceptorFn,
  HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { HttpErrorMessage } from '../../shared/model/http-error-message.model';
import { ProblemDetail } from '../../shared/model/problem-detail.model';
import { NotificationService } from '../services/notification.service';
import { DEFAULT_HTTP_ERROR, HTTP_ERRORS, NETWORK_ERROR } from './http-errors';

/**
 * Muestra un toast por cada error HTTP y relanza el error, para que el componente
 * solo restablezca su estado (p. ej. `isSubmitting`) sin repetir el manejo del mensaje.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const { title, message } = getHttpError(error.status);
      notify.error(title, getProblemMessage(error) ?? message);
      return throwError(() => error);
    })
  );
};

const getHttpError = (status: number): HttpErrorMessage => {
  if (status === 0) {
    return NETWORK_ERROR;
  }
  return HTTP_ERRORS[status as HttpStatusCode] ?? DEFAULT_HTTP_ERROR;
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
