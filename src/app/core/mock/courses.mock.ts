import { CourseResource } from '../../shared/model/course.model';
import { MOCK_INSTRUCTORS } from './instructors.mock';

/** Datos temporales. Se eliminan cuando las pantallas usen CourseService. */
export const MOCK_COURSES: CourseResource[] = [
  {
    id: 'b2222222-0000-0000-0000-000000000001',
    name: 'Introducción a Angular',
    description: 'Componentes, servicios y rutas desde cero.',
    duration: 20,
    level: 'BEGINNER',
    category: 'PROGRAMMING',
    instructor: MOCK_INSTRUCTORS[1],
  },
  {
    id: 'b2222222-0000-0000-0000-000000000002',
    name: 'Diseño de interfaces',
    description: 'Principios de usabilidad y jerarquía visual.',
    duration: 15,
    level: 'INTERMEDIATE',
    category: 'DESIGN',
    instructor: MOCK_INSTRUCTORS[2],
  },
  {
    id: 'b2222222-0000-0000-0000-000000000003',
    name: 'Finanzas para emprendedores',
    duration: 30,
    level: 'ADVANCED',
    category: 'BUSINESS',
    instructor: MOCK_INSTRUCTORS[0],
  },
  {
    id: 'b2222222-0000-0000-0000-000000000004',
    name: 'Inglés conversacional',
    description: 'Práctica oral para el trabajo diario.',
    duration: 40,
    level: 'BEGINNER',
    category: 'LANGUAGES',
    instructor: MOCK_INSTRUCTORS[3],
  },
];
