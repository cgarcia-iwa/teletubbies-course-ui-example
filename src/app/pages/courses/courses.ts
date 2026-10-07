import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CourseService } from '../../core/services/course.service';
import { CourseResource } from '../../shared/model/course.model';

/** Catálogo de cursos. */
@Component({
  selector: 'app-courses',
  imports: [AsyncPipe],
  templateUrl: './courses.html',
  styleUrl: './courses.scss'
})
export class Courses implements OnInit {
  private readonly courseService = inject(CourseService);

  courses$!: Observable<CourseResource[]>;

  ngOnInit(): void {
    this.loadCourses();
  }

  protected loadCourses(): void {
    this.courses$ = this.courseService
      .getAllByFilters()
      .pipe(map((response) => response.data.content));
  }
}
