import {
    HttpErrorResponse,
    HttpInterceptorFn,
    HttpRequest,
    HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap, tap } from 'rxjs';
import { Endpoints } from '../../constants/api-endpoints';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const storage = inject(StorageService);
    const authReq = attachAuth(req, storage.getAccessToken());

    return next(authReq).pipe(
        catchError((error) => {
            if (!shouldRefreshToken(error, req)) {
                throw error;
            }

            return from(authService.refreshToken()).pipe(
                switchMap(() => next(attachAuth(req, storage.getAccessToken()))),
                tap({ error: () => authService.logout({ expired: true }) })
            );
        })
    );
};

function attachAuth(
    req: HttpRequest<unknown>,
    accessToken: string | null
): HttpRequest<unknown> {
    const withCreds = req.url.includes('auth/');

    const tokenHeaders: Record<string, string> = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

    return req.clone({
        withCredentials: withCreds,
        setHeaders: tokenHeaders
    });
}

function shouldRefreshToken(error: unknown, req: HttpRequest<unknown>): boolean {
    const is401 =
        error instanceof HttpErrorResponse &&
        error.status === HttpStatusCode.Unauthorized;

    const isLoginRequest = req.url.endsWith(Endpoints.auth.login);

    return is401 && !isLoginRequest;
}
