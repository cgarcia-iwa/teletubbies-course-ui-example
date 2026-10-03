import { Pageable, PagedResources } from './page.model';
import { CourseLevel } from './course-level.model';
import { CourseCategory } from './course-category.model';
import { InstructorResource } from './instructor.model';

export interface CoursesFilterRequest extends Pageable {
  name?: string;
  level?: CourseLevel;
  category?: CourseCategory;
  instructorId?: string;
}

export interface CourseResource {
  id: string;
  name: string;
  description?: string;
  duration: number;
  level: CourseLevel;
  category: CourseCategory;
  instructor: InstructorResource;
}

export interface NewCourseRequest {
  name: string;
  description?: string;
  duration: number;
  level: CourseLevel;
  category: CourseCategory;
  instructorId: string;
}

export type UpdateCourseRequest = NewCourseRequest;

export interface CourseResponse {
  course: CourseResource;
}

export type CoursesPagedResources = PagedResources<CourseResource>;
