import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'danger';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const TOAST_DURATION_MS = 5000;

/** Cola de notificaciones (toasts) que pinta ToastContainer. */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly toastsState = signal<Toast[]>([]);
  private nextId = 0;

  readonly toasts = this.toastsState.asReadonly();

  success(title: string, message?: string): void {
    this.show('success', title, message);
  }

  error(title: string, message?: string): void {
    this.show('danger', title, message);
  }

  dismiss(id: number): void {
    this.toastsState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  private show(type: ToastType, title: string, message?: string): void {
    const id = ++this.nextId;
    this.toastsState.update((toasts) => [...toasts, { id, type, title, message }]);
    setTimeout(() => this.dismiss(id), TOAST_DURATION_MS);
  }
}
