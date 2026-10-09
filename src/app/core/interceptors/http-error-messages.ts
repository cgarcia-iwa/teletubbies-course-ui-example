interface HttpErrorMessage {
  title: string;
  message: string;
}

export const DEFAULT_HTTP_ERROR: HttpErrorMessage = {
  title: 'Error inesperado',
  message: 'Ocurrió un error al procesar la solicitud. Intenta de nuevo más tarde.'
};

/** Mensajes por status HTTP. `message` se reemplaza por `ProblemDetail.detail` si viene. */
export const HTTP_ERRORS: Record<number, HttpErrorMessage> = {
  0: {
    title: 'Sin conexión',
    message: 'No fue posible comunicarse con el servidor.'
  },
  400: {
    title: 'Solicitud inválida',
    message: 'Revisa los datos enviados.'
  },
  401: {
    title: 'No autorizado',
    message: 'Tu sesión expiró o las credenciales no son válidas.'
  },
  403: {
    title: 'Acceso denegado',
    message: 'No tienes permisos para realizar esta acción.'
  },
  404: {
    title: 'No encontrado',
    message: 'El recurso solicitado no existe.'
  },
  409: {
    title: 'Conflicto',
    message: 'El registro ya existe.'
  }
};
