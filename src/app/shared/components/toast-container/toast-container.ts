import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

/** Pinta los toasts de NotificationService. Se monta una sola vez en App. */
@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainer {
  protected readonly notify = inject(NotificationService);
}
