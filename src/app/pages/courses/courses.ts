import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { CourseService } from '../../core/services/course.service';

/** Catálogo de cursos. */
@Component({
  selector: 'app-courses',
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses {
  private readonly courseService = inject(CourseService);

  // signal: estado reactivo; la vista se actualiza sola cuando cambia.
  protected readonly courses = toSignal(
    this.courseService.getAllByFilters().pipe(map((response) => response.data.content)),
    { initialValue: [] }
  );
  protected readonly nameFilter = signal('');

  // computed: valor derivado que se recalcula cuando cambian courses o nameFilter.
  protected readonly filteredCourses = computed(() => {
    const filter = this.nameFilter().trim().toLowerCase();
    return this.courses().filter((course) => course.name.toLowerCase().includes(filter));
  });

  protected onFilterInput(event: Event): void {
    this.nameFilter.set((event.target as HTMLInputElement).value);
  }
}
