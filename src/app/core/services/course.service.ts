import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../api-urls';
import {
  CourseResponse,
  CoursesFilterRequest,
  CoursesPagedResources,
  NewCourseRequest,
  UpdateCourseRequest,
} from '../../shared/model/course.model';
import { ApiService } from './api.service';

/**
 * Acceso al API de cursos (teletubbies-course-example).
 * NOTA: todavía ningún componente lo usa; las pantallas trabajan con datos mock.
 */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = inject(ApiService);

  getAllByFilters(filters: CoursesFilterRequest = {}): Observable<CoursesPagedResources> {
    return this.api.get(API.GET_ALL_COURSES_BY_FILTERS_URL, filters);
  }

  getById(courseId: string): Observable<CourseResponse> {
    return this.api.get(API.GET_COURSE_BY_ID_URL.replace('{courseId}', courseId));
  }

  create(request: NewCourseRequest): Observable<CourseResponse> {
    return this.api.post(API.CREATE_COURSE_URL, request);
  }

  update(courseId: string, request: UpdateCourseRequest): Observable<CourseResponse> {
    return this.api.put(API.UPDATE_COURSE_URL.replace('{courseId}', courseId), request);
  }

  delete(courseId: string): Observable<void> {
    return this.api.delete(API.DELETE_COURSE_URL.replace('{courseId}', courseId));
  }
}
