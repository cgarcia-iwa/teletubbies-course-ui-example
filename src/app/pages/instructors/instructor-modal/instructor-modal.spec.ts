import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { InstructorService } from '../../../core/services/instructor.service';
import { InstructorResource, InstructorResponse } from '../../../shared/model/instructor.model';
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

  describe('validations (CREATE)', () => {
    beforeEach(() => open());

    it('should start invalid with TEACHER as default role', () => {
      expect(component.form.invalid).toBe(true);
      expect(component.form.controls.role.value).toBe('TEACHER');
    });

    it('should flag fullName as required, whitespace and maxlength', () => {
      const { fullName } = component.form.controls;
      fullName.setValue('');
      expect(fullName.hasError('required')).toBe(true);
      fullName.setValue('   ');
      expect(fullName.hasError('whitespace')).toBe(true);
      fullName.setValue('a'.repeat(151));
      expect(fullName.hasError('maxlength')).toBe(true);
      fullName.setValue('a'.repeat(150));
      expect(fullName.valid).toBe(true);
    });

    it('should flag email as required, invalid format and maxlength', () => {
      const { email } = component.form.controls;
      email.setValue('');
      expect(email.hasError('required')).toBe(true);
      email.setValue('not-an-email');
      expect(email.hasError('email')).toBe(true);
      email.setValue(`${'a'.repeat(140)}@test.com.mx`);
      expect(email.hasError('maxlength')).toBe(true);
    });

    it('should require a password between 7 and 12 characters', () => {
      const { password } = component.form.controls;
      password.setValue('');
      expect(password.hasError('required')).toBe(true);
      password.setValue('123456');
      expect(password.hasError('minlength')).toBe(true);
      password.setValue('1234567890123');
      expect(password.hasError('maxlength')).toBe(true);
      password.setValue('1234567');
      expect(password.valid).toBe(true);
    });

    it('should require confirmPassword to match password', () => {
      const { password, confirmPassword } = component.form.controls;
      password.setValue('secret12');
      confirmPassword.setValue('');
      expect(confirmPassword.hasError('required')).toBe(true);
      confirmPassword.setValue('secret13');
      expect(confirmPassword.hasError('mismatch')).toBe(true);
      confirmPassword.setValue('secret12');
      expect(confirmPassword.valid).toBe(true);
    });

    it('should revalidate confirmPassword when password changes', () => {
      fillValidForm();
      const { password, confirmPassword } = component.form.controls;
      password.setValue('another1');
      expect(confirmPassword.hasError('mismatch')).toBe(true);
      expect(component.form.invalid).toBe(true);
      password.setValue('secret12');
      expect(confirmPassword.valid).toBe(true);
    });

    it('should render role options and password field', () => {
      const element = fixture.nativeElement as HTMLElement;
      const options = Array.from(element.querySelectorAll('#instructor-role option')).map(
        (option) => (option as HTMLOptionElement).value
      );
      expect(options).toEqual(['ADMINISTRATOR', 'TEACHER']);
      expect(element.querySelector('#instructor-password')).not.toBeNull();
      expect(element.querySelector('#instructor-confirm-password')).not.toBeNull();
    });
  });

  describe('EDIT mode', () => {
    beforeEach(() => open('EDIT', INSTRUCTOR));

    it('should preload the instructor and stay pristine/untouched', () => {
      expect(component.form.getRawValue()).toEqual({
        fullName: INSTRUCTOR.fullName,
        email: INSTRUCTOR.email,
        password: '',
        confirmPassword: '',
        role: INSTRUCTOR.role
      });
      expect(component.form.pristine).toBe(true);
      expect(component.form.untouched).toBe(true);
    });

    it('should not require password nor render password/role fields', () => {
      expect(component.form.valid).toBe(true);
      const element = fixture.nativeElement as HTMLElement;
      expect(element.querySelector('#instructor-password')).toBeNull();
      expect(element.querySelector('#instructor-confirm-password')).toBeNull();
      expect(element.querySelector('#instructor-role')).toBeNull();
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

  describe('onSubmit (CREATE)', () => {
    beforeEach(() => open());

    it('should not submit when passwords do not match', () => {
      fillValidForm();
      component.form.controls.confirmPassword.setValue('different');

      component.onSubmit();

      expect(instructorService.create).not.toHaveBeenCalled();
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

    it('should ignore double submit while a request is pending', () => {
      const pending = new Subject<InstructorResponse>();
      instructorService.create.mockReturnValue(pending);
      fillValidForm();

      component.onSubmit();
      component.onSubmit();

      expect(instructorService.create).toHaveBeenCalledTimes(1);
      expect(component.isSubmitting()).toBe(true);
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
});
