import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { COURSE_CATEGORY_LABELS } from '../../shared/model/course-category.model';
import { COURSE_LEVEL_LABELS } from '../../shared/model/course-level.model';
import { CourseResource } from '../../shared/model/course.model';
import { ModalMode } from '../../shared/model/modal-mode.model';
import { CourseModal } from './course-modal/course-modal';

/** Catálogo de cursos. */
@Component({
  selector: 'app-courses',
  imports: [AsyncPipe, CourseModal],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly authService = inject(AuthService);

  courses$!: Observable<CourseResource[]>;

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

  protected loadCourses(): void {
    this.courses$ = this.courseService
      .getAllByFilters()
      .pipe(map((response) => response.data.content));
  }
}
