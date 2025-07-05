import {
   HttpErrorResponse,
   HttpInterceptorFn,
   HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, EMPTY, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(AuthService);
   const reqWithAuth = req.clone({ withCredentials: true });

   return next(reqWithAuth).pipe(
      catchError((error: HttpErrorResponse) => {
         if (error.status === HttpStatusCode.Unauthorized) {
            const isUserCheck = req.url.includes('auth/me');
            const isLoginAttempt = req.url.includes('auth/login');

            if (isLoginAttempt) {
               throw error;
            }

            if (isUserCheck) {
               return EMPTY;
            }

            authService.logout({ expired: true });
         }

         throw error;
      })
   );
};
