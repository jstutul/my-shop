import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingBarService =inject(LoadingBarService);
  loadingBarService.start();
  return next(req).pipe(finalize(()=>{
    loadingBarService.stop();
  }));
};
