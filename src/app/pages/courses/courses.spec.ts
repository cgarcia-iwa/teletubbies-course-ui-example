import { TestBed } from '@angular/core/testing';
import { EMPTY } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { InstructorRoleType } from '../../shared/model/instructor-role.model';
import { CourseResource } from '../../shared/model/course.model';
import { Courses } from './courses';

const courseOf = (email: string): CourseResource => ({
  id: 'course-1',
  name: 'Angular',
  duration: 10,
  level: 'BEGINNER',
  category: 'PROGRAMMING',
  instructor: { id: 'instructor-1', fullName: 'Po', email, role: 'TEACHER' }
});

describe('Courses', () => {
  const create = (role: InstructorRoleType): Courses => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: { getRole: () => role, getEmail: () => 'Po@teletubbies.test' }
        },
        { provide: CourseService, useValue: { getAllByFilters: () => EMPTY } }
      ]
    });
    return TestBed.runInInjectionContext(() => new Courses());
  };

  it('should let a TEACHER edit only their own courses', () => {
    const courses = create('TEACHER');

    expect(courses.canEdit(courseOf('po@teletubbies.test'))).toBe(true);
    expect(courses.canEdit(courseOf('dipsy@teletubbies.test'))).toBe(false);
  });

  it('should let an ADMINISTRATOR edit any course', () => {
    const courses = create('ADMINISTRATOR');

    expect(courses.canEdit(courseOf('dipsy@teletubbies.test'))).toBe(true);
  });
});
