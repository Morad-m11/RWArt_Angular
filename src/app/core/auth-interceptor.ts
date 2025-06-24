import {
   HttpErrorResponse,
   HttpEvent,
   HttpHandlerFn,
   HttpInterceptorFn,
   HttpRequest,
   HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { ACCESS_TOKEN_STORAGE_KEY } from './constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(AuthService);

   const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
   const authReq = req.clone({
      withCredentials: true,
      setHeaders: { Authorization: `Bearer ${accessToken}` }
   });

   return next(authReq).pipe(
      catchError((error) => {
         if (!(error instanceof HttpErrorResponse)) {
            throw error;
         }

         if (error.status !== HttpStatusCode.Unauthorized) {
            throw error;
         }

         if (req.url.includes('auth/login')) {
            throw error;
         }

         return refreshAndRetry(authReq, next, authService);
      })
   );
};

function refreshAndRetry(
   req: HttpRequest<unknown>,
   next: HttpHandlerFn,
   authService: AuthService
): Observable<HttpEvent<unknown>> {
   return from(authService.refreshToken()).pipe(
      switchMap(() => {
         const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
         const tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` }
         });
         return next(tokenReq);
      }),
      tap({
         error: () => authService.logout({ expired: true })
      })
   );
}
