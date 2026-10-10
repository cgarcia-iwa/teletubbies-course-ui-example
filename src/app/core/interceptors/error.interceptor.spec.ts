import {
  HttpClient,
  HttpStatusCode,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NotificationService } from '../services/notification.service';
import { errorInterceptor } from './error.interceptor';
import { HTTP_ERRORS } from './http-errors';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;
  let notify: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting()
      ]
    });
    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    notify = TestBed.inject(NotificationService);
    vi.spyOn(notify, 'error');
  });

  afterEach(() => httpTesting.verify());

  it('should show the ProblemDetail detail and rethrow the error', () => {
    const onError = vi.fn();
    http.post('/instructors', {}).subscribe({ error: onError });

    httpTesting
      .expectOne('/instructors')
      .flush({ detail: 'Email already exists' }, { status: 409, statusText: 'Conflict' });

    expect(notify.error).toHaveBeenCalledWith(
      HTTP_ERRORS[HttpStatusCode.Conflict]?.title,
      'Email already exists'
    );
    expect(onError).toHaveBeenCalled();
  });

  it('should list field errors when present', () => {
    http.post('/instructors', {}).subscribe({ error: () => undefined });

    httpTesting
      .expectOne('/instructors')
      .flush(
        { detail: 'Validation failed', errors: [{ field: 'email', message: 'must be valid' }] },
        { status: 400, statusText: 'Bad Request' }
      );

    expect(notify.error).toHaveBeenCalledWith(
      HTTP_ERRORS[HttpStatusCode.BadRequest]?.title,
      'email: must be valid'
    );
  });

  it('should fall back to the status message when there is no ProblemDetail', () => {
    http.get('/instructors').subscribe({ error: () => undefined });

    httpTesting.expectOne('/instructors').flush(null, { status: 403, statusText: 'Forbidden' });

    expect(notify.error).toHaveBeenCalledWith(
      HTTP_ERRORS[HttpStatusCode.Forbidden]?.title,
      HTTP_ERRORS[HttpStatusCode.Forbidden]?.message
    );
  });
});
