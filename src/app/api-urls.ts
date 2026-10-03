import { environment } from '../environments/environment';

export const API = {
  BASE_URL: environment.apiBaseUrl,

  GET_ALL_COURSES_BY_FILTERS_URL: 'courses',
  GET_COURSE_BY_ID_URL: 'courses/{courseId}',
  CREATE_COURSE_URL: 'courses',
  UPDATE_COURSE_URL: 'courses/{courseId}',
  DELETE_COURSE_URL: 'courses/{courseId}',

  GET_ALL_INSTRUCTORS_BY_FILTERS_URL: 'instructors',
  GET_INSTRUCTOR_BY_ID_URL: 'instructors/{instructorId}',
  CREATE_INSTRUCTOR_URL: 'instructors',
  UPDATE_INSTRUCTOR_URL: 'instructors/{instructorId}',
  DELETE_INSTRUCTOR_URL: 'instructors/{instructorId}',
};
