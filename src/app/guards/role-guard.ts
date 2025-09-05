import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    router.navigate(['/login']);
    return false;
  }
  
  let allowedRoles = route.data['roles'] as string[] || [];
  if (!allowedRoles.length && route.firstChild) {
    allowedRoles = route.firstChild.data['roles'] as string[] || [];
  }

  if (allowedRoles.length && !allowedRoles.includes(currentUser.role)) {
    router.navigate(['/access-denied']);
    return false;
  }

  return true;
};