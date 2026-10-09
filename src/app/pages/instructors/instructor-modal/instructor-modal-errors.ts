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
    { type: 'required', message: 'El nombre es obligatorio.' },
    { type: 'whitespace', message: 'El nombre no puede contener solo espacios.' },
    { type: 'maxlength', message: `Máximo ${FULL_NAME_MAX_LENGTH} caracteres.` }
  ],
  email: [
    { type: 'required', message: 'El correo es obligatorio.' },
    { type: 'email', message: 'Ingresa un correo electrónico válido.' },
    { type: 'maxlength', message: `Máximo ${EMAIL_MAX_LENGTH} caracteres.` }
  ],
  password: [
    { type: 'required', message: 'La contraseña es obligatoria.' },
    { type: 'minlength', message: `Mínimo ${PASSWORD_MIN_LENGTH} caracteres.` },
    { type: 'maxlength', message: `Máximo ${PASSWORD_MAX_LENGTH} caracteres.` }
  ],
  confirmPassword: [
    { type: 'required', message: 'Confirma la contraseña.' },
    { type: 'mismatch', message: 'Las contraseñas no coinciden.' }
  ],
  role: [{ type: 'required', message: 'El rol es obligatorio.' }]
};
