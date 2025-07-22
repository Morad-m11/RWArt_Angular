import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject } from '@angular/core';
import { CoreSnackbarMessages } from './messages';
import { SnackbarService } from './services/snackbar/snackbar.service';

export class GlobalErrorHandler implements ErrorHandler {
    private readonly _snackbar = inject(SnackbarService);

    handleError(error: Error | unknown): void {
        try {
            const isHttpError = error instanceof HttpErrorResponse;

            if (!isHttpError) {
                console.error(error);
            }

            this._snackbar.error(
                `${CoreSnackbarMessages.unhandled}: ${JSON.stringify(error)}`
            );
        } catch (error2) {
            console.error('Error while handling uncaught error', {
                error: error2,
                originalError: error
            });
        }
    }
}
