import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { InstructorService } from '../../core/services/instructor.service';
import { InstructorResource } from '../../shared/model/instructor.model';
import { ModalMode } from '../../shared/model/modal-mode.model';
import { InstructorModal } from './instructor-modal/instructor-modal';

/** Catálogo de instructores. */
@Component({
  selector: 'app-instructors',
  imports: [AsyncPipe, InstructorModal],
  templateUrl: './instructors.html',
  styleUrl: './instructors.scss'
})
export class Instructors implements OnInit {
  private readonly instructorService = inject(InstructorService);
  private readonly authService = inject(AuthService);

  instructors$!: Observable<InstructorResource[]>;

  // Solo ADMINISTRATOR puede dar de alta instructores.
  readonly canCreate = this.authService.getRole() === 'ADMINISTRATOR';
  readonly showInstructorModal = signal(false);
  readonly instructorModalMode = signal<ModalMode>('CREATE');
  readonly selectedInstructor = signal<InstructorResource | null>(null);

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors(): void {
    this.instructors$ = this.instructorService
      .getAllByFilters()
      .pipe(map((response) => response.data.content));
  }

  openCreate(): void {
    this.instructorModalMode.set('CREATE');
    this.selectedInstructor.set(null);
    this.showInstructorModal.set(true);
  }

  onInstructorSaved(): void {
    this.showInstructorModal.set(false);
    this.loadInstructors();
  }
}
