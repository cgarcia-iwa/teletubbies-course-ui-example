export type ErrorType = 'email' | 'max' | 'maxlength' | 'min' | 'minlength' | 'required';

export interface FormValidationError {
  type: ErrorType;
  message: string;
}
