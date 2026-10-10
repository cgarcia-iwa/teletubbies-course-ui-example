export const INSTRUCTOR_ROLES = ['ADMINISTRATOR', 'TEACHER'] as const;

export type InstructorRoleType = (typeof INSTRUCTOR_ROLES)[number];

/** Rol que el backend asigna cuando no se especifica uno. */
export const DEFAULT_INSTRUCTOR_ROLE: InstructorRoleType = 'TEACHER';

/** Etiquetas para mostrar los roles en la UI. */
export const INSTRUCTOR_ROLE_LABELS: Record<InstructorRoleType, string> = {
  ADMINISTRATOR: 'Administrator',
  TEACHER: 'Teacher'
};
