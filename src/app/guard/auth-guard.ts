import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';
import { isTokenExpired } from '../utils/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService=inject(AccountService);
  const router = inject(Router);
  const token = accountService.getToken();
  if(!token){
    return router.navigateByUrl('/login');
  }
  if(isTokenExpired(token)){
    return router.navigateByUrl('/login');
  }
  return true;
};
