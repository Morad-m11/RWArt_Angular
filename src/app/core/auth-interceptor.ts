import {
   HttpErrorResponse,
   HttpInterceptorFn,
   HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(AuthService);
   const reqWithAuth = req.clone({ withCredentials: true });

   return next(reqWithAuth).pipe(
      catchError((err: HttpErrorResponse) => {
         if (err.status === HttpStatusCode.Unauthorized) {
            authService.logout({ expired: true });
         }

         return throwError(() => err);
      })
   );
};
