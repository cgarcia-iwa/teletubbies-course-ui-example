import { Component, computed, signal } from '@angular/core';
import { MOCK_COURSES } from '../../core/mock/courses.mock';

/**
 * Catálogo de cursos.
 * Para conectarlo al API: inyectar CourseService con inject() y reemplazar
 * MOCK_COURSES por courseService.getAllByFilters(...) (data.content del resultado).
 */
@Component({
  selector: 'app-courses',
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses {
  // signal: estado reactivo; la vista se actualiza sola cuando cambia.
  protected readonly courses = signal(MOCK_COURSES);
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
