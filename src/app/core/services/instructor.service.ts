import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CREATE_INSTRUCTOR_URL,
  DELETE_INSTRUCTOR_URL,
  GET_ALL_INSTRUCTORS_BY_FILTERS_URL,
  GET_INSTRUCTOR_BY_ID_URL,
  UPDATE_INSTRUCTOR_URL
} from '../../api-urls';
import {
  InstructorResponse,
  InstructorsFilterRequest,
  InstructorsPagedResources,
  NewInstructorRequest,
  UpdateInstructorRequest
} from '../../shared/model/instructor.model';
import { ApiService } from './api.service';

/**
 * Acceso al API de instructores (teletubbies-course-example).
 * NOTA: todavía ningún componente lo usa; las pantallas trabajan con datos mock.
 */
@Injectable({ providedIn: 'root' })
export class InstructorService {
  private readonly api = inject(ApiService);

  getAllByFilters(filters: InstructorsFilterRequest = {}): Observable<InstructorsPagedResources> {
    return this.api.get(GET_ALL_INSTRUCTORS_BY_FILTERS_URL, filters);
  }

  getById(instructorId: string): Observable<InstructorResponse> {
    return this.api.get(GET_INSTRUCTOR_BY_ID_URL.replace('{instructorId}', instructorId));
  }

  create(request: NewInstructorRequest): Observable<InstructorResponse> {
    return this.api.post(CREATE_INSTRUCTOR_URL, request);
  }

  update(instructorId: string, request: UpdateInstructorRequest): Observable<InstructorResponse> {
    return this.api.put(UPDATE_INSTRUCTOR_URL.replace('{instructorId}', instructorId), request);
  }

  delete(instructorId: string): Observable<void> {
    return this.api.delete(DELETE_INSTRUCTOR_URL.replace('{instructorId}', instructorId));
  }
}
