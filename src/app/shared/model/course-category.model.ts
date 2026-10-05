export const COURSE_CATEGORIES = [
  'PROGRAMMING',
  'DESIGN',
  'BUSINESS',
  'LANGUAGES',
  'SCIENCE',
  'ARTS',
] as const;

export type CourseCategory = (typeof COURSE_CATEGORIES)[number];
