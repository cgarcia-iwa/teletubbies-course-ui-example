import { FormValidationError } from '../../../shared/model/form-validation-error.model';

// Límites de NewCourseRequest / UpdateCourseRequest (open-api/requests.yaml).
export const NAME_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 200;
export const DURATION_MIN = 1;
export const INTEGER_PATTERN = /^\d+$/;

export interface CourseModalErrorType {
  name: FormValidationError[];
  description: FormValidationError[];
  duration: FormValidationError[];
  level: FormValidationError[];
  category: FormValidationError[];
  instructorId: FormValidationError[];
}

export const COURSE_MODAL_ERRORS: CourseModalErrorType = {
  name: [
    { type: 'required', message: 'Name is required.' },
    { type: 'whitespace', message: 'Name cannot contain only spaces.' },
    { type: 'maxlength', message: `Name must be at most ${NAME_MAX_LENGTH} characters.` }
  ],
  description: [
    {
      type: 'maxlength',
      message: `Description must be at most ${DESCRIPTION_MAX_LENGTH} characters.`
    }
  ],
  duration: [
    { type: 'required', message: 'Duration is required.' },
    { type: 'pattern', message: 'Duration must be a whole number of hours.' },
    { type: 'min', message: `Duration must be at least ${DURATION_MIN} hour.` }
  ],
  level: [{ type: 'required', message: 'Level is required.' }],
  category: [{ type: 'required', message: 'Category is required.' }],
  instructorId: [{ type: 'required', message: 'Instructor is required.' }]
};
