import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { CoreSnackbarMessages } from '../../messages';
import { SnackbarService } from '../../services/snackbar/snackbar.service';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const snackbar = inject(SnackbarService);

    return next(req).pipe(
        catchError((error) => {
            if (isConnectionError(error)) {
                snackbar.error(CoreSnackbarMessages.connection);
            }

            throw error;
        })
    );
};

function isConnectionError(error: unknown): boolean {
    return !error || !(error instanceof HttpErrorResponse) || error.status === 0;
}
