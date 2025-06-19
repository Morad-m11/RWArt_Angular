import { ErrorHandler, inject } from '@angular/core';
import { SnackbarService } from '../snackbar/snackbar.service';

export class GlobalErrorHandler implements ErrorHandler {
   private readonly _snackbar = inject(SnackbarService);

   handleError(error: Error | unknown): void {
      try {
         this._snackbar.error(`Unhandled error ${JSON.stringify(error)}`);
      } catch (error2) {
         console.error('Error while handling uncaught error', {
            error: error2,
            originalError: error,
         });
      }
   }
}
