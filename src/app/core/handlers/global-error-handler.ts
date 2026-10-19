import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject, Injectable, Injector } from '@angular/core';
import { NotificationService } from '../services/notification.service';

/**
 * Captura excepciones no atrapadas por ningún try/catch (bugs de template, errores de
 * runtime). Reemplaza el ErrorHandler por defecto, que solo hace console.error, para
 * además avisar al usuario.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Inyección diferida: ErrorHandler se construye antes que el resto del árbol de providers.
  private readonly injector = inject(Injector);

  handleError(error: unknown): void {
    console.error(error);

    if (error instanceof HttpErrorResponse) {
      return;
    }

    this.injector
      .get(NotificationService)
      .error('Unexpected error', 'Something went wrong. Please try again.');
  }
}
