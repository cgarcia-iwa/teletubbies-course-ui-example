import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { InstructorService } from '../../../core/services/instructor.service';
import { InstructorResource } from '../../../shared/model/instructor.model';
import { InstructorModal } from './instructor-modal';

const INSTRUCTOR: InstructorResource = {
  id: 'abc-123',
  fullName: 'Laa-Laa',
  email: 'laalaa@teletubbies.test',
  role: 'ADMINISTRATOR'
};

describe('InstructorModal', () => {
  let fixture: ComponentFixture<InstructorModal>;
  let component: InstructorModal;
  let instructorService: { create: ReturnType<typeof vi.fn>; update: ReturnType<typeof vi.fn> };

  const open = async (
    mode: 'CREATE' | 'EDIT' = 'CREATE',
    instructor: InstructorResource | null = null
  ) => {
    fixture.componentRef.setInput('visible', true);
    fixture.componentRef.setInput('mode', mode);
    fixture.componentRef.setInput('instructor', instructor);
    await fixture.whenStable();
  };

  const fillValidForm = (): void => {
    component.form.setValue({
      fullName: '  Tinky Winky  ',
      email: 'tinky@teletubbies.test',
      password: 'secret12',
      confirmPassword: 'secret12',
      role: 'TEACHER'
    });
  };

  beforeEach(async () => {
    instructorService = { create: vi.fn(), update: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [InstructorModal],
      providers: [{ provide: InstructorService, useValue: instructorService }]
    }).compileComponents();

    fixture = TestBed.createComponent(InstructorModal);
    component = fixture.componentInstance;
  });

  describe('CREATE', () => {
    beforeEach(() => open());

    it('should start invalid with TEACHER as default role', () => {
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls.role.value).toBe('TEACHER');
    });

    it('should require confirmPassword to match password, even after password changes', () => {
      fillValidForm();
      const { password, confirmPassword } = component.form.controls;
      expect(confirmPassword.valid).toBe(true);

      password.setValue('another1');

      expect(confirmPassword.hasError('mismatch')).toBe(true);
      expect(component.form.invalid).toBe(true);
    });

    it('should not call the service and mark controls as touched when invalid', () => {
      component.onSubmit();

      expect(instructorService.create).not.toHaveBeenCalled();
      expect(component.form.controls.fullName.touched).toBe(true);
    });

    it('should call create and emit saved on success', () => {
      const saved = vi.fn();
      component.saved.subscribe(saved);
      instructorService.create.mockReturnValue(of({ instructor: INSTRUCTOR }));
      fillValidForm();

      component.onSubmit();

      expect(instructorService.create).toHaveBeenCalledWith(component.form.getRawValue());
      expect(saved).toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reset isSubmitting and not emit saved on error', () => {
      const saved = vi.fn();
      component.saved.subscribe(saved);
      instructorService.create.mockReturnValue(throwError(() => new Error('409')));
      fillValidForm();

      component.onSubmit();

      expect(saved).not.toHaveBeenCalled();
      expect(component.isSubmitting()).toBe(false);
    });
  });

  describe('EDIT', () => {
    beforeEach(() => open('EDIT', INSTRUCTOR));

    it('should preload the instructor, stay pristine and not require password', () => {
      expect(component.form.getRawValue()).toEqual({
        fullName: INSTRUCTOR.fullName,
        email: INSTRUCTOR.email,
        password: '',
        confirmPassword: '',
        role: INSTRUCTOR.role
      });
      expect(component.form.pristine).toBe(true);
      expect(component.form.valid).toBe(true);
    });

    it('should call update with the instructor id', () => {
      instructorService.update.mockReturnValue(of({ instructor: INSTRUCTOR }));

      component.onSubmit();

      expect(instructorService.update).toHaveBeenCalledWith(
        INSTRUCTOR.id,
        component.form.getRawValue()
      );
      expect(instructorService.create).not.toHaveBeenCalled();
    });
  });
});
