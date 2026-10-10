import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CREATE_COURSE_URL } from '../../api-urls';
import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(CourseService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('should trim, convert duration to number and omit an empty description', () => {
    service
      .create({
        name: '  Angular  ',
        description: '   ',
        duration: '12',
        level: 'BEGINNER',
        category: 'PROGRAMMING',
        instructorId: 'instructor-1'
      })
      .subscribe();

    const req = httpTesting.expectOne(CREATE_COURSE_URL);
    expect(req.request.body).toEqual({
      name: 'Angular',
      duration: 12,
      level: 'BEGINNER',
      category: 'PROGRAMMING',
      instructorId: 'instructor-1'
    });
    req.flush({});
  });
});
