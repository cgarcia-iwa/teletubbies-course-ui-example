import { Pageable, PagedResources } from './page.model';
import { InstructorRole } from './instructor-role.model';

export interface InstructorsFilterRequest extends Pageable {
  fullName?: string;
  email?: string;
  role?: InstructorRole;
}

export interface InstructorResource {
  id: string;
  fullName: string;
  email: string;
  role: InstructorRole;
}

export interface NewInstructorRequest {
  fullName: string;
  email: string;
  password?: string;
  role?: InstructorRole;
}

export interface UpdateInstructorRequest {
  fullName: string;
  email: string;
}

export interface InstructorResponse {
  instructor: InstructorResource;
}

export type InstructorsPagedResources = PagedResources<InstructorResource>;
