import { environment } from '../environments/environment';

const BASE_URL = environment.apiBaseUrl;

export const LOGIN_URL = `${BASE_URL}/auth/login`;

export const GET_ALL_COURSES_BY_FILTERS_URL = `${BASE_URL}/courses`;
export const GET_COURSE_BY_ID_URL = `${BASE_URL}/courses/{courseId}`;
export const CREATE_COURSE_URL = `${BASE_URL}/courses`;
export const UPDATE_COURSE_URL = `${BASE_URL}/courses/{courseId}`;
export const DELETE_COURSE_URL = `${BASE_URL}/courses/{courseId}`;

export const GET_ALL_INSTRUCTORS_BY_FILTERS_URL = `${BASE_URL}/instructors`;
export const GET_INSTRUCTOR_BY_ID_URL = `${BASE_URL}/instructors/{instructorId}`;
export const CREATE_INSTRUCTOR_URL = `${BASE_URL}/instructors`;
export const UPDATE_INSTRUCTOR_URL = `${BASE_URL}/instructors/{instructorId}`;
export const DELETE_INSTRUCTOR_URL = `${BASE_URL}/instructors/{instructorId}`;
