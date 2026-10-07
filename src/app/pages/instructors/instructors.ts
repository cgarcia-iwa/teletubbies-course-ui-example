import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InstructorService } from '../../core/services/instructor.service';
import { InstructorResource } from '../../shared/model/instructor.model';

/** Catálogo de instructores. */
@Component({
  selector: 'app-instructors',
  imports: [AsyncPipe],
  templateUrl: './instructors.html',
  styleUrl: './instructors.scss'
})
export class Instructors implements OnInit {
  private readonly instructorService = inject(InstructorService);

  instructors$!: Observable<InstructorResource[]>;

  ngOnInit(): void {
    this.loadInstructors();
  }

  loadInstructors(): void {
    this.instructors$ = this.instructorService
      .getAllByFilters()
      .pipe(map((response) => response.data.content));
  }
}
