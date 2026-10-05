export const INSTRUCTOR_ROLES = ['ADMINISTRATOR', 'TEACHER'] as const;

export type InstructorRole = (typeof INSTRUCTOR_ROLES)[number];
