import { FormValidationError } from '../../shared/model/form-validation-error.model';

export interface LoginErrorType {
  email: FormValidationError[];
  password: FormValidationError[];
}

export const LOGIN_ERRORS: LoginErrorType = {
  email: [
    { type: 'required', message: 'Email address is required.' },
    { type: 'email', message: 'Enter a valid email address.' },
    { type: 'maxlength', message: 'Email address is too long.' }
  ],
  password: [
    { type: 'required', message: 'Password is required.' },
    { type: 'minlength', message: 'Password must be at least 6 characters.' },
    { type: 'maxlength', message: 'Password must be at most 20 characters.' }
  ]
};
