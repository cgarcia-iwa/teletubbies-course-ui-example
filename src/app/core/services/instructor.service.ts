import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CREATE_INSTRUCTOR_URL,
  DELETE_INSTRUCTOR_URL,
  GET_ALL_INSTRUCTORS_BY_FILTERS_URL,
  GET_INSTRUCTOR_BY_ID_URL,
  UPDATE_INSTRUCTOR_URL
} from '../../api-urls';
import { InstructorRoleType } from '../../shared/model/instructor-role.model';
import {
  InstructorResponse,
  InstructorsFilterRequest,
  InstructorsPagedResources,
  NewInstructorRequest,
  UpdateInstructorRequest
} from '../../shared/model/instructor.model';
import { ApiService } from './api.service';

/** Valor del formulario de instructor (crear/editar). En EDIT, `password` y `role` no se envían. */
export interface InstructorFormValue {
  fullName: string;
  email: string;
  password: string;
  role: InstructorRoleType;
}

/** Acceso al API de instructores (teletubbies-course-example). */
@Injectable({ providedIn: 'root' })
export class InstructorService {
  private readonly api = inject(ApiService);

  getAllByFilters(filters: InstructorsFilterRequest = {}): Observable<InstructorsPagedResources> {
    return this.api.get(GET_ALL_INSTRUCTORS_BY_FILTERS_URL, filters);
  }

  getById(instructorId: string): Observable<InstructorResponse> {
    return this.api.get(GET_INSTRUCTOR_BY_ID_URL.replace('{instructorId}', instructorId));
  }

  create(formValue: InstructorFormValue): Observable<InstructorResponse> {
    return this.api.post(CREATE_INSTRUCTOR_URL, this.toNewRequest(formValue));
  }

  update(instructorId: string, formValue: InstructorFormValue): Observable<InstructorResponse> {
    return this.api.put(
      UPDATE_INSTRUCTOR_URL.replace('{instructorId}', instructorId),
      this.toUpdateRequest(formValue)
    );
  }

  delete(instructorId: string): Observable<void> {
    return this.api.delete(DELETE_INSTRUCTOR_URL.replace('{instructorId}', instructorId));
  }

  private toNewRequest({
    fullName,
    email,
    password,
    role
  }: InstructorFormValue): NewInstructorRequest {
    return {
      fullName: fullName.trim(),
      email: email.trim(),
      password,
      role
    };
  }

  private toUpdateRequest({ fullName, email }: InstructorFormValue): UpdateInstructorRequest {
    return {
      fullName: fullName.trim(),
      email: email.trim()
    };
  }
}
