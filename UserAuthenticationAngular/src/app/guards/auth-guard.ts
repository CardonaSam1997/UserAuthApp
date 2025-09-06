import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']); 
    return false;
  }

  return true; 
};
