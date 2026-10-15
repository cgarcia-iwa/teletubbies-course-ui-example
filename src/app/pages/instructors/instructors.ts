import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, filter, Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { InstructorService } from '../../core/services/instructor.service';
import { NotificationService } from '../../core/services/notification.service';
import { Pagination } from '../../shared/components/pagination/pagination';
import { DEBOUNCE_TIME, PAGE_SIZE } from '../../shared/constants';
import {
  INSTRUCTOR_ROLE_LABELS,
  INSTRUCTOR_ROLES,
  InstructorRoleType
} from '../../shared/model/instructor-role.model';
import { InstructorResource, InstructorsFilterRequest } from '../../shared/model/instructor.model';
import { ModalMode } from '../../shared/model/modal-mode.model';
import { PageInfo } from '../../shared/model/page.model';
import { InstructorModal } from './instructor-modal/instructor-modal';

/** Catálogo de instructores. */
@Component({
  selector: 'app-instructors',
  imports: [ReactiveFormsModule, Pagination, InstructorModal],
  templateUrl: './instructors.html',
  styleUrl: './instructors.scss'
})
export class Instructors implements OnInit {
  private readonly instructorService = inject(InstructorService);
  private readonly authService = inject(AuthService);
  private readonly notify = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  private loadSubscription?: Subscription;

  // `null` = cargando.
  readonly instructors = signal<InstructorResource[] | null>(null);
  readonly page = signal<PageInfo>({ number: 0, size: PAGE_SIZE, totalElements: 0 });

  readonly filtersForm = inject(NonNullableFormBuilder).group({
    fullName: ['', [Validators.maxLength(100)]],
    email: ['', [Validators.maxLength(100)]],
    role: '' as InstructorRoleType | ''
  });
  readonly roles = INSTRUCTOR_ROLES;

  // Solo ADMINISTRATOR puede crear y editar instructores.
  readonly canManage = this.authService.getRole() === 'ADMINISTRATOR';
  // Columnas de la tabla (incluye "Actions" si aplica), para el colspan de las filas vacías.
  readonly columnCount = this.canManage ? 4 : 3;
  readonly roleLabels = INSTRUCTOR_ROLE_LABELS;
  readonly showInstructorModal = signal(false);
  readonly instructorModalMode = signal<ModalMode>('CREATE');
  readonly selectedInstructor = signal<InstructorResource | null>(null);

  ngOnInit(): void {
    this.loadInstructors();

    // Al cambiar cualquier filtro (con debounce) se regresa a la primera página.
    this.filtersForm.valueChanges
      .pipe(
        debounceTime(DEBOUNCE_TIME),
        filter(() => this.filtersForm.valid),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.page.update((page) => ({ ...page, number: 0 }));
        this.loadInstructors();
      });
  }

  onPageChange(pageNumber: number): void {
    this.page.update((page) => ({ ...page, number: pageNumber }));
    this.loadInstructors();
  }

  resetFilters(): void {
    this.filtersForm.reset(); // dispara valueChanges → recarga desde la página 0
  }

  loadInstructors(): void {
    const { fullName, email, role } = this.filtersForm.getRawValue();
    const filters: InstructorsFilterRequest = {
      fullName: fullName.trim(),
      email: email.trim(),
      role: role || undefined,
      page: this.page().number,
      size: PAGE_SIZE
    };

    this.instructors.set(null);
    this.loadSubscription?.unsubscribe(); // descarta una consulta anterior aún en curso
    this.loadSubscription = this.instructorService.getAllByFilters(filters).subscribe({
      next: ({ data, page, totalElements }) => {
        this.instructors.set(data.content);
        this.page.set({ ...page, totalElements });
      },
      // El error ya se notifica en el interceptor; aquí solo se deja de mostrar "Cargando".
      error: () => this.instructors.set([])
    });
  }

  openCreate(): void {
    this.instructorModalMode.set('CREATE');
    this.selectedInstructor.set(null);
    this.showInstructorModal.set(true);
  }

  openEdit(instructor: InstructorResource): void {
    this.instructorModalMode.set('EDIT');
    this.selectedInstructor.set(instructor);
    this.showInstructorModal.set(true);
  }

  onInstructorSaved(): void {
    this.showInstructorModal.set(false);
    this.loadInstructors();
  }

  deleteInstructor(instructor: InstructorResource): void {
    if (!confirm(`¿Eliminar al instructor "${instructor.fullName}"? Esta acción no se puede deshacer.`)) return;
    this.instructorService.delete(instructor.id).subscribe({
      next: () => {
        this.notify.success('Instructor eliminado', `"${instructor.fullName}" fue eliminado correctamente.`);
        this.loadInstructors();
      }
    });
  }
}
