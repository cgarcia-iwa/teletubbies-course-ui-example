import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { InstructorRoleType } from '../../shared/model/instructor-role.model';
import { AuthService } from '../services/auth.service';

const ALL_ROLES: InstructorRoleType[] = ['ADMINISTRATOR', 'TEACHER'];

/** `data` esperada en rutas protegidas por {@link authGuard}. */
export interface AuthRouteData {
  allowedRoles?: InstructorRoleType[];
}

/**
 * Lee `data: { allowedRoles: [...] }` de la ruta. Si no se definió, permite
 * cualquier rol válido (hoy ADMINISTRATOR y TEACHER tienen acceso de lectura
 * a cursos e instructores). Ej: { path: 'courses', data: { allowedRoles: ['ADMINISTRATOR'] } }.
 */
const getAllowedRoles = (route: ActivatedRouteSnapshot): InstructorRoleType[] => {
  const allowedRoles = (route.data as AuthRouteData).allowedRoles;

  if (!Array.isArray(allowedRoles)) {
    return ALL_ROLES;
  }

  return allowedRoles.filter((role): role is InstructorRoleType => ALL_ROLES.includes(role));
};

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  const allowedRoles = getAllowedRoles(route);

  return allowedRoles.includes(authService.getRole()) || router.createUrlTree(['/login']);
};
