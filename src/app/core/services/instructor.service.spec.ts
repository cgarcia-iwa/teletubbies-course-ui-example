import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CREATE_INSTRUCTOR_URL, UPDATE_INSTRUCTOR_URL } from '../../api-urls';
import { InstructorFormValue, InstructorService } from './instructor.service';

const FORM_VALUE: InstructorFormValue = {
  fullName: '  Dipsy  ',
  email: ' dipsy@teletubbies.test ',
  password: 'secret12',
  role: 'TEACHER'
};

describe('InstructorService', () => {
  let service: InstructorService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(InstructorService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should POST a trimmed NewInstructorRequest on create without confirmPassword', () => {
    // El formulario incluye confirmPassword; el mapper no debe enviarlo.
    const rawFormValue = { ...FORM_VALUE, confirmPassword: 'secret12' };
    service.create(rawFormValue).subscribe();

    const req = httpTesting.expectOne(CREATE_INSTRUCTOR_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      fullName: 'Dipsy',
      email: 'dipsy@teletubbies.test',
      password: 'secret12',
      role: 'TEACHER'
    });
    req.flush({});
  });

  it('should PUT only fullName and email on update', () => {
    service.update('abc-123', FORM_VALUE).subscribe();

    const req = httpTesting.expectOne(UPDATE_INSTRUCTOR_URL.replace('{instructorId}', 'abc-123'));
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ fullName: 'Dipsy', email: 'dipsy@teletubbies.test' });
    req.flush({});
  });
});
