import { InstructorResource } from '../../shared/model/instructor.model';

/** Datos temporales. Se eliminan cuando las pantallas usen InstructorService. */
export const MOCK_INSTRUCTORS: InstructorResource[] = [
  { id: 'a1111111-0000-0000-0000-000000000001', fullName: 'Tinky Winky', email: 'tinky.winky@teletubbies.com', role: 'ADMINISTRATOR' },
  { id: 'a1111111-0000-0000-0000-000000000002', fullName: 'Dipsy', email: 'dipsy@teletubbies.com', role: 'TEACHER' },
  { id: 'a1111111-0000-0000-0000-000000000003', fullName: 'Laa-Laa', email: 'laa.laa@teletubbies.com', role: 'TEACHER' },
  { id: 'a1111111-0000-0000-0000-000000000004', fullName: 'Po', email: 'po@teletubbies.com', role: 'TEACHER' },
];
