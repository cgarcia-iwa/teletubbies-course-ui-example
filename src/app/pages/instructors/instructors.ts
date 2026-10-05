import { Component, computed, signal } from '@angular/core';
import { MOCK_INSTRUCTORS } from '../../core/mock/instructors.mock';

/**
 * Catálogo de instructores.
 * Para conectarlo al API: inyectar InstructorService con inject() y reemplazar
 * MOCK_INSTRUCTORS por instructorService.getAllByFilters(...) (data.content del resultado).
 */
@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.html',
  styleUrl: './instructors.scss',
})
export class Instructors {
  protected readonly instructors = signal(MOCK_INSTRUCTORS);
  protected readonly nameFilter = signal('');

  protected readonly filteredInstructors = computed(() => {
    const filter = this.nameFilter().trim().toLowerCase();
    return this.instructors().filter((instructor) =>
      instructor.fullName.toLowerCase().includes(filter),
    );
  });

  protected onFilterInput(event: Event): void {
    this.nameFilter.set((event.target as HTMLInputElement).value);
  }
}
