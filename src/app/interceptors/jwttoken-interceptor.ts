import { HttpInterceptorFn } from '@angular/common/http';
import { AccountService } from '../services/account.service';
import { inject } from '@angular/core';

export const jwttokenInterceptor: HttpInterceptorFn = (req, next) => {
  const accountService = inject(AccountService);
  const token =  accountService.getToken();
  

  if(!token){
    return next(req);
  }
  const cloneRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  return next(cloneRequest);
};
