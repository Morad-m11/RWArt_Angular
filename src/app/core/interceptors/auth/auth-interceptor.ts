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
import { ACCESS_TOKEN_STORAGE_KEY } from '../../constants';
import { AuthService } from '../../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const authService = inject(AuthService);
   const authReq = attachAuth(req);

   return next(authReq).pipe(
      catchError((error) => {
         if (!shouldRefreshToken(error, req)) {
            throw error;
         }

         return refreshAndRetry(req, next, authService);
      })
   );
};

function attachAuth(req: HttpRequest<unknown>): typeof req {
   const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

   return req.clone({
      withCredentials: true,
      setHeaders: { Authorization: `Bearer ${accessToken}` }
   });
}

function shouldRefreshToken(error: unknown, req: HttpRequest<unknown>): boolean {
   const isHttpError = error instanceof HttpErrorResponse;
   if (!isHttpError) {
      return false;
   }

   const is401 = error.status === HttpStatusCode.Unauthorized;
   const isLoginRequest = req.url.includes('auth/login');

   return is401 && !isLoginRequest;
}

function refreshAndRetry(
   req: HttpRequest<unknown>,
   next: HttpHandlerFn,
   authService: AuthService
): Observable<HttpEvent<unknown>> {
   return from(authService.refreshToken()).pipe(
      switchMap(() => next(attachAuth(req))),
      tap({ error: () => authService.logout({ expired: true }) })
   );
}
