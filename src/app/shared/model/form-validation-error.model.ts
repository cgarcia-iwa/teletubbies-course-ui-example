export type ErrorType =
  | 'email'
  | 'max'
  | 'maxlength'
  | 'min'
  | 'minlength'
  | 'mismatch'
  | 'pattern'
  | 'required'
  | 'whitespace';

export interface FormValidationError {
  type: ErrorType;
  message: string;
}
