import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, inject } from '@angular/core';
import { CoreSnackbarMessages } from './messages';
import { SnackbarService } from './services/snackbar/snackbar.service';

export class GlobalErrorHandler implements ErrorHandler {
    private readonly _snackbar = inject(SnackbarService);

    handleError(error: Error | unknown): void {
        try {
            if (!(error instanceof HttpErrorResponse)) {
                console.error(error);
            }

            this._snackbar.error(
                `${CoreSnackbarMessages.unhandled}: ${this._extractMessage(error)}`
            );
        } catch (error2) {
            console.error('Error while handling uncaught error', {
                error: error2,
                originalError: error
            });
        }
    }

    private _extractMessage(error: Error | unknown) {
        if (error instanceof Error) {
            return error.message;
        }

        if (typeof error === 'string') {
            return error;
        }

        return JSON.stringify(error);
    }
}
