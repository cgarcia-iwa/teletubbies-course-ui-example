import { Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { merge, of, switchMap } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { FormValidationError } from '../../model/form-validation-error.model';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.html'
})
export class ValidationMessage {
  readonly control = input<AbstractControl | null>(null);
  readonly errors = input<FormValidationError[]>([]);

  private readonly liveControl = toSignal(
    toObservable(this.control).pipe(
      switchMap((control) =>
        control
          ? merge(control.valueChanges, control.statusChanges).pipe(startWith(control))
          : of(null)
      )
    ),
    { initialValue: null }
  );

  protected readonly visibleErrors = computed(() => {
    this.liveControl();
    const control = this.control();
    if (!control || !(control.touched || control.dirty)) {
      return [];
    }
    return this.errors().filter((error) => control.hasError(error.type));
  });
}
