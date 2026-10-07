import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'courses' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login)
  },
  // loadComponent: carga el componente bajo demanda (lazy loading).
  {
    path: 'courses',
    loadComponent: () => import('./pages/courses/courses').then((m) => m.Courses)
  },
  {
    path: 'instructors',
    loadComponent: () => import('./pages/instructors/instructors').then((m) => m.Instructors)
  }
];
