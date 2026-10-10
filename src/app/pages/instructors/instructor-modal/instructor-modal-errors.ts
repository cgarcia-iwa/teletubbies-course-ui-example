import { FormValidationError } from '../../../shared/model/form-validation-error.model';

// Límites de NewInstructorRequest / UpdateInstructorRequest (open-api/requests.yaml).
export const FULL_NAME_MAX_LENGTH = 150;
export const EMAIL_MAX_LENGTH = 150;
export const PASSWORD_MIN_LENGTH = 7;
export const PASSWORD_MAX_LENGTH = 12;

export interface InstructorModalErrorType {
  fullName: FormValidationError[];
  email: FormValidationError[];
  password: FormValidationError[];
  confirmPassword: FormValidationError[];
  role: FormValidationError[];
}

export const INSTRUCTOR_MODAL_ERRORS: InstructorModalErrorType = {
  fullName: [
    { type: 'required', message: 'Full name is required.' },
    { type: 'whitespace', message: 'Full name cannot contain only spaces.' },
    { type: 'maxlength', message: `Full name must be at most ${FULL_NAME_MAX_LENGTH} characters.` }
  ],
  email: [
    { type: 'required', message: 'Email address is required.' },
    { type: 'email', message: 'Enter a valid email address.' },
    { type: 'maxlength', message: `Email address must be at most ${EMAIL_MAX_LENGTH} characters.` }
  ],
  password: [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.` },
    { type: 'maxlength', message: `Password must be at most ${PASSWORD_MAX_LENGTH} characters.` }
  ],
  confirmPassword: [
    { type: 'required', message: 'Please confirm the password.' },
    { type: 'mismatch', message: 'Passwords do not match.' }
  ],
  role: [{ type: 'required', message: 'Role is required.' }]
};
