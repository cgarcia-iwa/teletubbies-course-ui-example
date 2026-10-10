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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, filter, of, startWith, switchMap } from 'rxjs';
import { CourseFormValue, CourseService } from '../../../core/services/course.service';
import { InstructorService } from '../../../core/services/instructor.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ValidationMessage } from '../../../shared/components/validation-message/validation-message';
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_LABELS,
  CourseCategory
} from '../../../shared/model/course-category.model';
import {
  COURSE_LEVEL_LABELS,
  COURSE_LEVELS,
  CourseLevel
} from '../../../shared/model/course-level.model';
import { CourseResource } from '../../../shared/model/course.model';
import { InstructorResource } from '../../../shared/model/instructor.model';
import { ModalMode } from '../../../shared/model/modal-mode.model';
import { noWhitespaceValidator } from '../../../shared/utils/custom-validators';
import {
  COURSE_MODAL_ERRORS,
  DESCRIPTION_MAX_LENGTH,
  DURATION_MIN,
  INTEGER_PATTERN,
  NAME_MAX_LENGTH
} from './course-modal-errors';

/** Formulario para crear (CREATE) o editar (EDIT) un curso. */
@Component({
  selector: 'app-course-modal',
  imports: [ReactiveFormsModule, ValidationMessage],
  templateUrl: './course-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseModal {
  private readonly fb = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly instructorService = inject(InstructorService);
  private readonly notify = inject(NotificationService);

  readonly visible = input.required<boolean>();
  readonly mode = input<ModalMode>('CREATE');
  readonly course = input<CourseResource | null>(null);
  readonly closed = output<void>();
  readonly saved = output<void>();

  readonly isSubmitting = signal(false);
  readonly isEditMode = computed(() => this.mode() === 'EDIT');
  readonly validationMessages = COURSE_MODAL_ERRORS;
  readonly levels = COURSE_LEVELS;
  readonly levelLabels = COURSE_LEVEL_LABELS;
  readonly categories = COURSE_CATEGORIES;
  readonly categoryLabels = COURSE_CATEGORY_LABELS;

  // Se recargan cada vez que se abre el modal; `null` mientras cargan.
  private readonly instructorOptions = toSignal(
    toObservable(this.visible).pipe(
      filter(Boolean),
      switchMap(() =>
        this.instructorService.getOptions().pipe(
          startWith(null),
          // El toast de error ya lo muestra errorInterceptor.
          catchError(() => of([]))
        )
      )
    ),
    { initialValue: null }
  );

  readonly isLoadingInstructors = computed(() => this.instructorOptions() === null);

  /** Incluye al instructor actual del curso aunque no venga en la lista (límite de tamaño). */
  readonly instructors = computed<InstructorResource[]>(() => {
    const options = this.instructorOptions() ?? [];
    const current = this.course()?.instructor;

    if (!current || options.some(({ id }) => id === current.id)) {
      return options;
    }
    return [current, ...options];
  });

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, noWhitespaceValidator, Validators.maxLength(NAME_MAX_LENGTH)]],
    description: ['', [Validators.maxLength(DESCRIPTION_MAX_LENGTH)]],
    duration: [
      '',
      [Validators.required, Validators.pattern(INTEGER_PATTERN), Validators.min(DURATION_MIN)]
    ],
    level: this.fb.nonNullable.control<CourseLevel | ''>('', [Validators.required]),
    category: this.fb.nonNullable.control<CourseCategory | ''>('', [Validators.required]),
    instructorId: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      if (!this.visible()) {
        return;
      }

      const course = this.course();

      // Solo debe reaccionar a visible/course, no a signals internos del formulario.
      untracked(() => {
        this.form.reset({
          name: course?.name ?? '',
          description: course?.description ?? '',
          duration: course ? String(course.duration) : '',
          level: course?.level ?? '',
          category: course?.category ?? '',
          instructorId: course?.instructor.id ?? ''
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

    const value: CourseFormValue = this.form.getRawValue();
    const course = this.course();
    const isEdit = this.isEditMode() && !!course;
    const request$ = isEdit
      ? this.courseService.update(course.id, value)
      : this.courseService.create(value);
    const successTitle = isEdit ? 'Course updated' : 'Course created';

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
}
