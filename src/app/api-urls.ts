import { environment } from '../environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const API = {
  BASE_URL,

  LOGIN_URL: `${BASE_URL}/auth/login`,

  GET_ALL_COURSES_BY_FILTERS_URL: `${BASE_URL}/courses`,
  GET_COURSE_BY_ID_URL: `${BASE_URL}/courses/{courseId}`,
  CREATE_COURSE_URL: `${BASE_URL}/courses`,
  UPDATE_COURSE_URL: `${BASE_URL}/courses/{courseId}`,
  DELETE_COURSE_URL: `${BASE_URL}/courses/{courseId}`,

  GET_ALL_INSTRUCTORS_BY_FILTERS_URL: `${BASE_URL}/instructors`,
  GET_INSTRUCTOR_BY_ID_URL: `${BASE_URL}/instructors/{instructorId}`,
  CREATE_INSTRUCTOR_URL: `${BASE_URL}/instructors`,
  UPDATE_INSTRUCTOR_URL: `${BASE_URL}/instructors/{instructorId}`,
  DELETE_INSTRUCTOR_URL: `${BASE_URL}/instructors/{instructorId}`
};
