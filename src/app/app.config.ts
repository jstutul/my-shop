import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideLoadingBar } from '@ngx-loading-bar/core';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { jwttokenInterceptor } from './interceptors/jwttoken-interceptor';
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([loadingInterceptor,jwttokenInterceptor])),
    provideLoadingBar({          
    }),
  ]
};
