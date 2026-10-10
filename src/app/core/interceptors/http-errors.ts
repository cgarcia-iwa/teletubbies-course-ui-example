import { HttpStatusCode } from '@angular/common/http';
import { HttpErrorMessage } from '../../shared/model/http-error-message.model';

export type HttpErrorType = Partial<Record<HttpStatusCode, HttpErrorMessage>>;

/** Sin respuesta del servidor (status 0: red caída, CORS, servidor apagado). */
export const NETWORK_ERROR: HttpErrorMessage = {
  title: 'Sin conexión',
  message: 'No fue posible comunicarse con el servidor.'
};

export const DEFAULT_HTTP_ERROR: HttpErrorMessage = {
  title: 'Error inesperado',
  message: 'Ocurrió un error al procesar la solicitud. Intenta de nuevo más tarde.'
};

/** Mensajes por status HTTP. `message` se reemplaza por `ProblemDetail.detail` si viene. */
export const HTTP_ERRORS: HttpErrorType = {
  [HttpStatusCode.BadRequest]: {
    title: 'Solicitud inválida',
    message: 'Revisa los datos enviados.'
  },
  [HttpStatusCode.Unauthorized]: {
    title: 'No autorizado',
    message: 'Tu sesión expiró o las credenciales no son válidas.'
  },
  [HttpStatusCode.Forbidden]: {
    title: 'Acceso denegado',
    message: 'No tienes permisos para realizar esta acción.'
  },
  [HttpStatusCode.NotFound]: {
    title: 'No encontrado',
    message: 'El recurso solicitado no existe.'
  },
  [HttpStatusCode.Conflict]: {
    title: 'Conflicto',
    message: 'El registro ya existe.'
  }
};
