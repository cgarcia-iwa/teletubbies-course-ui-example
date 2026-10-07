import { Pageable, PagedResources } from './page.model';
import { InstructorRoleType } from './instructor-role.model';

export interface InstructorsFilterRequest extends Pageable {
  fullName?: string;
  email?: string;
  role?: InstructorRoleType;
}

export interface InstructorResource {
  id: string;
  fullName: string;
  email: string;
  role: InstructorRoleType;
}

export interface NewInstructorRequest {
  fullName: string;
  email: string;
  password?: string;
  role?: InstructorRoleType;
}

export interface UpdateInstructorRequest {
  fullName: string;
  email: string;
}

export interface InstructorResponse {
  instructor: InstructorResource;
}

export type InstructorsPagedResources = PagedResources<InstructorResource>;
