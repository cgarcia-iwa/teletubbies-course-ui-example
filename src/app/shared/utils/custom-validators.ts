import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Rejects strings that consist entirely of whitespace.
 * Use alongside Validators.required when trimmed emptiness must be caught.
 */
export const noWhitespaceValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  if (value === null || value === undefined || value === '') return null;
  return String(value).trim().length > 0 ? null : { whitespace: true };
};

/**
 * Factory validator: fails with `mismatch` when the value differs from the sibling control
 * `controlName` (e.g. confirm password). Re-run it when the sibling changes.
 */
export const matchControlValidator = (controlName: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    const other = control.parent?.get(controlName);
    if (!other) return null;
    return value === other.value ? null : { mismatch: true };
  };
};
