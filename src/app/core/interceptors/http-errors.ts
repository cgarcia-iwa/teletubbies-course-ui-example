import { HttpStatusCode } from '@angular/common/http';
import { HttpErrorMessage } from '../../shared/model/http-error-message.model';

export type HttpErrorType = Partial<Record<HttpStatusCode, HttpErrorMessage>>;

/** Sin respuesta del servidor (status 0: red caída, CORS, servidor apagado). */
export const NETWORK_ERROR: HttpErrorMessage = {
  title: 'Connection error',
  message: 'Unable to reach the server.'
};

export const DEFAULT_HTTP_ERROR: HttpErrorMessage = {
  title: 'Unexpected error',
  message: 'Something went wrong while processing the request. Please try again later.'
};

/** Mensajes por status HTTP. `message` se reemplaza por `ProblemDetail.detail` si viene. */
export const HTTP_ERRORS: HttpErrorType = {
  [HttpStatusCode.BadRequest]: {
    title: 'Invalid request',
    message: 'Please review the submitted data.'
  },
  [HttpStatusCode.Unauthorized]: {
    title: 'Unauthorized',
    message: 'Your session has expired or the credentials are invalid.'
  },
  [HttpStatusCode.Forbidden]: {
    title: 'Access denied',
    message: 'You do not have permission to perform this action.'
  },
  [HttpStatusCode.NotFound]: {
    title: 'Not found',
    message: 'The requested resource does not exist.'
  },
  [HttpStatusCode.Conflict]: {
    title: 'Conflict',
    message: 'The record already exists.'
  }
};
