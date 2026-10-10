export const COURSE_CATEGORIES = [
  'PROGRAMMING',
  'DESIGN',
  'BUSINESS',
  'LANGUAGES',
  'SCIENCE',
  'ARTS'
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];

/** Etiquetas para mostrar las categorías en la UI. */
export const COURSE_CATEGORY_LABELS: Record<CourseCategory, string> = {
  PROGRAMMING: 'Programming',
  DESIGN: 'Design',
  BUSINESS: 'Business',
  LANGUAGES: 'Languages',
  SCIENCE: 'Science',
  ARTS: 'Arts'
};
