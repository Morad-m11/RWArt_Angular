import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
    HttpStatusCode
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, from, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';

let refreshRequest$: Observable<unknown> | null = null;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const storage = inject(StorageService);

    if (refreshRequest$) {
        return waitForRefreshAndRetry(req, next, storage);
    }

    const authReq = attachAuth(req, storage.getAccessToken());

    return next(authReq).pipe(
        catchError((error) => refreshAuthOrThrow(req, next, error, authService, storage))
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

function refreshAuthOrThrow(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    originalError: unknown,
    authService: AuthService,
    storage: StorageService
) {
    const hasAccessToken = storage.hasAccessToken();
    const isAuthRequest = req.url.includes('auth/') && !req.url.endsWith('auth/me');
    const is401 =
        originalError instanceof HttpErrorResponse &&
        originalError.status === HttpStatusCode.Unauthorized;

    if (!hasAccessToken || !is401 || isAuthRequest) {
        throw originalError;
    }

    return refreshAndRetry(req, next, authService, storage).pipe(
        catchError(() => {
            throw originalError;
        })
    );
}

function refreshAndRetry(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authService: AuthService,
    storage: StorageService
) {
    if (!refreshRequest$) {
        refreshRequest$ = from(authService.refreshAuth()).pipe(
            tap({ error: () => authService.logout({ expired: true }) }),
            finalize(() => {
                refreshRequest$ = null;
            })
        );
    }

    return waitForRefreshAndRetry(req, next, storage);
}

function waitForRefreshAndRetry(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    storage: StorageService
) {
    return refreshRequest$!.pipe(
        switchMap(() => next(attachAuth(req, storage.getAccessToken())))
    );
}
