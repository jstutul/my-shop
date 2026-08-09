import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../states/auth-state';

export const adminGuard: CanActivateFn = (route, state) => {
  const authSate = inject(AuthState);
  const router =inject(Router);
  if(authSate.isAdmin()){
    return true;
  }
  return router.createUrlTree(['/']);
};
