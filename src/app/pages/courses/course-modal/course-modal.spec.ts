import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CourseService } from '../../../core/services/course.service';
import { InstructorService } from '../../../core/services/instructor.service';
import { CourseResource } from '../../../shared/model/course.model';
import { InstructorResource } from '../../../shared/model/instructor.model';
import { CourseModal } from './course-modal';

const PO: InstructorResource = {
  id: 'instructor-1',
  fullName: 'Po',
  email: 'po@teletubbies.test',
  role: 'TEACHER'
};

const COURSE: CourseResource = {
  id: 'course-1',
  name: 'Angular',
  description: 'Signals and forms',
  duration: 12,
  level: 'BEGINNER',
  category: 'PROGRAMMING',
  instructor: { ...PO, id: 'instructor-99', fullName: 'Noo-Noo' }
};

describe('CourseModal', () => {
  let fixture: ComponentFixture<CourseModal>;
  let component: CourseModal;
  let courseService: { create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };

  const open = async (mode: 'CREATE' | 'EDIT' = 'CREATE', course: CourseResource | null = null) => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('mode', mode);
    fixture.componentRef.setInput('course', course);
    await fixture.whenStable();
  };

  const fillValidForm = (): void => {
    component.form.setValue({
      name: 'Angular',
      description: '',
      duration: '12',
      level: 'BEGINNER',
      category: 'PROGRAMMING',
      instructorId: PO.id
    });
  };

  beforeEach(async () => {
    courseService = { create: vi.fn(), update: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [CourseModal],
      providers: [
        { provide: CourseService, useValue: courseService },
        { provide: InstructorService, useValue: { getOptions: () => of([PO]) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CourseModal);
    component = fixture.componentInstance;
  });

  describe('CREATE', () => {
    beforeEach(() => open());

    it('should start invalid and load the instructor options', () => {
      expect(component.form.invalid).toBe(true);
      expect(component.instructors()).toEqual([PO]);
    });

    it('should require duration to be a whole number of at least 1 hour', () => {
      const { duration } = component.form.controls;
      duration.setValue('1.5');
      expect(duration.hasError('pattern')).toBe(true);
      duration.setValue('0');
      expect(duration.hasError('min')).toBe(true);
      duration.setValue('1');
      expect(duration.valid).toBe(true);
    });

    it('should not call the service and mark controls as touched when invalid', () => {
      component.onSubmit();

      expect(courseService.create).not.toHaveBeenCalled();
      expect(component.form.controls.name.touched).toBe(true);
    });

    it('should call create and emit saved on success', () => {
      const saved = vi.fn();
      component.saved.subscribe(saved);
      courseService.create.mockReturnValue(of({ course: COURSE }));
      fillValidForm();

      component.onSubmit();

      expect(courseService.create).toHaveBeenCalledWith(component.form.getRawValue());
      expect(saved).toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('EDIT', () => {
    beforeEach(() => open('EDIT', COURSE));

    it('should preload the course and keep its instructor even if not in the options', () => {
      expect(component.form.getRawValue()).toEqual({
        name: COURSE.name,
        description: COURSE.description,
        duration: '12',
        level: COURSE.level,
        category: COURSE.category,
        instructorId: COURSE.instructor.id
      });
      expect(component.instructors().map(({ id }) => id)).toEqual([COURSE.instructor.id, PO.id]);
      expect(component.isSaveDisabled()).toBe(true);
    });

    it('should call update with the course id', () => {
      courseService.update.mockReturnValue(of({ course: COURSE }));

      component.onSubmit();

      expect(courseService.update).toHaveBeenCalledWith(COURSE.id, component.form.getRawValue());
      expect(courseService.create).not.toHaveBeenCalled();
    });
  });
});
