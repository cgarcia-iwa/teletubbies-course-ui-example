import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { InstructorService } from '../../core/services/instructor.service';

/** Catálogo de instructores. */
@Component({
  selector: 'app-instructors',
  templateUrl: './instructors.html',
  styleUrl: './instructors.scss'
})
export class Instructors {
  private readonly instructorService = inject(InstructorService);

  protected readonly instructors = toSignal(
    this.instructorService.getAllByFilters().pipe(map((response) => response.data.content)),
    { initialValue: [] }
  );
  protected readonly nameFilter = signal('');

  protected readonly filteredInstructors = computed(() => {
    const filter = this.nameFilter().trim().toLowerCase();
    return this.instructors().filter((instructor) =>
      instructor.fullName.toLowerCase().includes(filter)
    );
  });

  protected onFilterInput(event: Event): void {
    this.nameFilter.set((event.target as HTMLInputElement).value);
  }
}
