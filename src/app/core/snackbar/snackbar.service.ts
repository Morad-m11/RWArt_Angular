import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
   providedIn: 'root',
})
export class SnackbarService {
   private readonly _snackbar = inject(MatSnackBar);

   success(message: string): void {
      this._snackbar.open(message, undefined, {
         verticalPosition: 'top',
         duration: 2000,
         panelClass: 'snackbar-success',
      });
   }

   error(message: string): void {
      this._snackbar.open(message, 'Close', {
         verticalPosition: 'top',
         panelClass: 'snackbar-error',
      });
   }
}
