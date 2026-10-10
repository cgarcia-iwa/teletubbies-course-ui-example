export const COURSE_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;

export type CourseLevel = (typeof COURSE_LEVELS)[number];

/** Etiquetas para mostrar los niveles en la UI. */
export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced'
};
