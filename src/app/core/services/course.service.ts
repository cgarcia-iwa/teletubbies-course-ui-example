import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CREATE_COURSE_URL,
  DELETE_COURSE_URL,
  GET_ALL_COURSES_BY_FILTERS_URL,
  GET_COURSE_BY_ID_URL,
  UPDATE_COURSE_URL
} from '../../api-urls';
import { CourseCategory } from '../../shared/model/course-category.model';
import { CourseLevel } from '../../shared/model/course-level.model';
import {
  CourseResponse,
  CoursesFilterRequest,
  CoursesPagedResources,
  NewCourseRequest,
  UpdateCourseRequest
} from '../../shared/model/course.model';
import { ApiService } from './api.service';

/**
 * Valor del formulario de curso (crear/editar). `duration` es texto (input numérico validado
 * con pattern); `level`/`category` inician vacíos hasta que se elige una opción.
 */
export interface CourseFormValue {
  name: string;
  description: string;
  duration: string;
  level: CourseLevel | '';
  category: CourseCategory | '';
  instructorId: string;
}

/** Acceso al API de cursos (teletubbies-course-example). */
@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly api = inject(ApiService);

  getAllByFilters(filters: CoursesFilterRequest = {}): Observable<CoursesPagedResources> {
    return this.api.get(GET_ALL_COURSES_BY_FILTERS_URL, filters);
  }

  getById(courseId: string): Observable<CourseResponse> {
    return this.api.get(GET_COURSE_BY_ID_URL.replace('{courseId}', courseId));
  }

  create(formValue: CourseFormValue): Observable<CourseResponse> {
    return this.api.post(CREATE_COURSE_URL, this.toRequest(formValue));
  }

  update(courseId: string, formValue: CourseFormValue): Observable<CourseResponse> {
    return this.api.put(
      UPDATE_COURSE_URL.replace('{courseId}', courseId),
      this.toRequest(formValue)
    );
  }

  delete(courseId: string): Observable<void> {
    return this.api.delete(DELETE_COURSE_URL.replace('{courseId}', courseId));
  }

  /** `level`/`category` ya vienen validados como requeridos por el formulario. */
  private toRequest({
    name,
    description,
    duration,
    level,
    category,
    instructorId
  }: CourseFormValue): NewCourseRequest | UpdateCourseRequest {
    const trimmedDescription = description.trim();

    return {
      name: name.trim(),
      ...(trimmedDescription && { description: trimmedDescription }),
      duration: Number(duration),
      level: level as CourseLevel,
      category: category as CourseCategory,
      instructorId
    };
  }
}
