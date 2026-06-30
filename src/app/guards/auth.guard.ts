import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @description
 * Guard que permite el acceso solo a usuarios con sesión iniciada.
 * Si no hay sesión, redirige a la página de login.
 * @returns true si está autenticado, o un UrlTree hacia `/login`.
 */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.estaAutenticado() ? true : router.createUrlTree(['/login']);
};

/**
 * @description
 * Guard que permite el acceso solo a usuarios con rol de administrador.
 * Si no cumple, redirige a la página de login.
 * @returns true si es administrador, o un UrlTree hacia `/login`.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.esAdmin() ? true : router.createUrlTree(['/login']);
};
