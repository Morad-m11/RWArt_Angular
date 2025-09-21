import {
    HttpErrorResponse,
    HttpInterceptorFn,
    HttpRequest,
    HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const storage = inject(StorageService);
    const authReq = attachAuth(req, storage.getAccessToken());

    return next(authReq).pipe(
        catchError((error) => {
            if (!isHandleableAuthError(error)) {
                throw error;
            }

            return from(authService.handleAuthError(error)).pipe(
                switchMap(() => next(attachAuth(req, storage.getAccessToken())))
            );
        })
    );
};

const attachAuth = (
    req: HttpRequest<unknown>,
    accessToken: string | null
): HttpRequest<unknown> => {
    const withCreds = req.url.includes('auth/');

    const tokenHeaders: Record<string, string> = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};

    return req.clone({
        withCredentials: withCreds,
        setHeaders: tokenHeaders
    });
};

const isHandleableAuthError = (error: unknown): boolean => {
    if (!(error instanceof HttpErrorResponse)) {
        return false;
    }

    if (error.status !== HttpStatusCode.Unauthorized) {
        return false;
    }

    if (error.url?.includes('auth/') && !error.url?.endsWith('auth/me')) {
        return false;
    }

    return true;
};
