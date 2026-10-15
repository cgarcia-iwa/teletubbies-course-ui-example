import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, debounceTime, filter, of, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { InstructorService } from '../../core/services/instructor.service';
import { NotificationService } from '../../core/services/notification.service';
import { Pagination } from '../../shared/components/pagination/pagination';
import { DEBOUNCE_TIME, PAGE_SIZE } from '../../shared/constants';
import {
  COURSE_CATEGORIES,
  COURSE_CATEGORY_LABELS,
  CourseCategory
} from '../../shared/model/course-category.model';
import {
  COURSE_LEVEL_LABELS,
  COURSE_LEVELS,
  CourseLevel
} from '../../shared/model/course-level.model';
import { CourseResource, CoursesFilterRequest } from '../../shared/model/course.model';
import { ModalMode } from '../../shared/model/modal-mode.model';
import { PageInfo } from '../../shared/model/page.model';
import { CourseModal } from './course-modal/course-modal';

/** Catálogo de cursos. */
@Component({
  selector: 'app-courses',
  imports: [ReactiveFormsModule, Pagination, CourseModal],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly instructorService = inject(InstructorService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private loadSubscription?: Subscription;

  // signals: estado que la vista lee y se actualiza sola al cambiar. `null` = cargando.
  readonly courses = signal<CourseResource[] | null>(null);
  readonly page = signal<PageInfo>({ number: 0, size: PAGE_SIZE, totalElements: 0 });

  // Formulario reactivo con un control por filtro ('' = sin filtrar).
  readonly filtersForm = inject(NonNullableFormBuilder).group({
    name: ['', [Validators.maxLength(100)]],
    level: '' as CourseLevel | '',
    category: '' as CourseCategory | '',
    instructorId: ''
  });
  readonly levels = COURSE_LEVELS;
  readonly categories = COURSE_CATEGORIES;
  // Opciones del filtro de instructor; si falla la carga el filtro queda sin opciones.
  readonly instructorOptions = toSignal(
    this.instructorService.getOptions().pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  // Solo ADMINISTRATOR crea cursos y edita cualquiera; un TEACHER solo edita los suyos
  // (el backend también lo valida y responde 403).
  readonly isAdmin = this.authService.getRole() === 'ADMINISTRATOR';
  readonly canCreate = this.isAdmin;
  private readonly userEmail = this.authService.getEmail().toLowerCase();
  readonly levelLabels = COURSE_LEVEL_LABELS;
  readonly categoryLabels = COURSE_CATEGORY_LABELS;
  readonly showCourseModal = signal(false);
  readonly courseModalMode = signal<ModalMode>('CREATE');
  readonly selectedCourse = signal<CourseResource | null>(null);

  ngOnInit(): void {
    this.loadCourses();

    // Al cambiar cualquier filtro (con debounce) se regresa a la primera página.
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME),
        filter(() => this.filtersForm.valid),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.page.update((page) => ({ ...page, number: 0 }));
        this.loadCourses();
      });
  }

  onPageChange(pageNumber: number): void {
    this.page.update((page) => ({ ...page, number: pageNumber }));
    this.loadCourses();
  }

  resetFilters(): void {
    this.filtersForm.reset(); // dispara valueChanges → recarga desde la página 0
  }

  canEdit(course: CourseResource): boolean {
    return this.isAdmin || course.instructor.email.toLowerCase() === this.userEmail;
  }

  openCreate(): void {
    this.courseModalMode.set('CREATE');
    this.selectedCourse.set(null);
    this.showCourseModal.set(true);
  }

  openEdit(course: CourseResource): void {
    this.courseModalMode.set('EDIT');
    this.selectedCourse.set(course);
    this.showCourseModal.set(true);
  }

  onCourseSaved(): void {
    this.showCourseModal.set(false);
    this.loadCourses();
  }

  deleteCourse(course: CourseResource): void {
    if (!confirm(`¿Eliminar el curso "${course.name}"? Esta acción no se puede deshacer.`)) return;
    this.courseService.delete(course.id).subscribe({
      next: () => {
        this.notify.success('Curso eliminado', `"${course.name}" fue eliminado correctamente.`);
        this.loadCourses();
      }
    });
  }

  protected loadCourses(): void {
    const { name, level, category, instructorId } = this.filtersForm.getRawValue();
    const filters: CoursesFilterRequest = {
      name: name.trim(),
      level: level || undefined,
      category: category || undefined,
      instructorId: instructorId || undefined,
      page: this.page().number,
      size: PAGE_SIZE
    };

    this.courses.set(null);
    this.loadSubscription?.unsubscribe(); // descarta una consulta anterior aún en curso
    this.loadSubscription = this.courseService.getAllByFilters(filters).subscribe({
      next: ({ data, page, totalElements }) => {
        this.courses.set(data.content);
        this.page.set({ ...page, totalElements });
      },
      // El error ya se notifica en el interceptor; aquí solo se deja de mostrar "Cargando".
      error: () => this.courses.set([])
    });
  }
}
