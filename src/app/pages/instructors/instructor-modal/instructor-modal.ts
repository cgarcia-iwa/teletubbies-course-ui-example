import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InstructorFormValue, InstructorService } from '../../../core/services/instructor.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';
import {
  DEFAULT_INSTRUCTOR_ROLE,
  INSTRUCTOR_ROLE_LABELS,
  INSTRUCTOR_ROLES,
  InstructorRoleType
} from '../../../shared/model/instructor-role.model';
import { InstructorResource } from '../../../shared/model/instructor.model';
import { ModalMode } from '../../../shared/model/modal-mode.model';
import {
  matchControlValidator,
  noWhitespaceValidator
} from '../../../shared/utils/custom-validators';
import {
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  INSTRUCTOR_MODAL_ERRORS,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH
} from './instructor-modal-errors';

const PASSWORD_VALIDATORS = [
  Validators.required,
  Validators.minLength(PASSWORD_MIN_LENGTH),
  Validators.maxLength(PASSWORD_MAX_LENGTH)
];

const CONFIRM_PASSWORD_VALIDATORS = [Validators.required, matchControlValidator('password')];

/**
 * Formulario para crear (CREATE) o editar (EDIT) un instructor.
 * `password`, `confirmPassword` y `role` solo aplican en CREATE: UpdateInstructorRequest no los incluye.
 */
@Component({
  selector: 'app-instructor-modal',
  imports: [ReactiveFormsModule, ValidationMessage],
  templateUrl: './instructor-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstructorModal {
  private readonly fb = inject(FormBuilder);
  private readonly instructorService = inject(InstructorService);
  private readonly notify = inject(NotificationService);

  readonly visible = input.required<boolean>();
  readonly mode = input<ModalMode>('CREATE');
  readonly instructor = input<InstructorResource | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);
  readonly isEditMode = computed(() => this.mode() === 'EDIT');
  readonly validationMessages = INSTRUCTOR_MODAL_ERRORS;
  readonly roles = INSTRUCTOR_ROLES;
  readonly roleLabels = INSTRUCTOR_ROLE_LABELS;

  readonly form = this.fb.nonNullable.group({
    fullName: [
      '',
      [Validators.required, noWhitespaceValidator, Validators.maxLength(FULL_NAME_MAX_LENGTH)]
    ],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(EMAIL_MAX_LENGTH)]],
    password: ['', PASSWORD_VALIDATORS],
    confirmPassword: ['', CONFIRM_PASSWORD_VALIDATORS],
    role: this.fb.nonNullable.control<InstructorRoleType>(DEFAULT_INSTRUCTOR_ROLE, [
      Validators.required
    ])
  });

  constructor() {
    const { password, confirmPassword } = this.form.controls;

    // La confirmación depende de `password`: se revalida cuando ésta cambia.
    password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => confirmPassword.updateValueAndValidity());

    effect(() => {
      if (!this.visible()) {
        return;
      }

      const instructor = this.instructor();
      const mode = this.mode();

      // Solo debe reaccionar a visible/mode/instructor, no a signals internos del formulario.
      untracked(() => {
        this.applyModeValidators(mode);
        this.form.reset({
          fullName: instructor?.fullName ?? '',
          email: instructor?.email ?? '',
          password: '',
          confirmPassword: '',
          role: instructor?.role ?? DEFAULT_INSTRUCTOR_ROLE
        });
      });
    });
  }

  onClose(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.form.reset();
    this.closed.emit();
  }

  /** En EDIT no se permite guardar sin cambios (evita un PUT idéntico). */
  isSaveDisabled(): boolean {
    return this.form.invalid || this.isSubmitting() || (this.isEditMode() && this.form.pristine);
  }

  onSubmit(): void {
    if (this.isSubmitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value: InstructorFormValue = this.form.getRawValue();
    const instructor = this.instructor();
    const isEdit = this.isEditMode() && !!instructor;
    const request$ = isEdit
      ? this.instructorService.update(instructor.id, value)
      : this.instructorService.create(value);
    const successTitle = isEdit ? 'Instructor updated' : 'Instructor created';

    this.isSubmitting.set(true);

    request$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.notify.success(successTitle, 'Changes were saved successfully.');
        this.saved.emit();
      },
      error: () => {
        // El toast de error ya lo muestra errorInterceptor.
        this.isSubmitting.set(false);
      }
    });
  }

  /** `password`, `confirmPassword` y `role` solo se validan en CREATE. */
  private applyModeValidators(mode: ModalMode): void {
    const { password, confirmPassword, role } = this.form.controls;

    if (mode === 'EDIT') {
      password.clearValidators();
      confirmPassword.clearValidators();
      role.clearValidators();
    } else {
      password.setValidators(PASSWORD_VALIDATORS);
      confirmPassword.setValidators(CONFIRM_PASSWORD_VALIDATORS);
      role.setValidators([Validators.required]);
    }

    password.updateValueAndValidity({ emitEvent: false });
    confirmPassword.updateValueAndValidity({ emitEvent: false });
    role.updateValueAndValidity({ emitEvent: false });
  }
}
