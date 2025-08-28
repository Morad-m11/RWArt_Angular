import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class SnackbarService {
    private readonly _snackbar = inject(MatSnackBar);

    success(message: string, duration = 2000): void {
        this._snackbar.open(message, undefined, {
            verticalPosition: 'bottom',
            duration,
            panelClass: 'snackbar-success'
        });
    }

    error(message: string, duration?: number): void {
        this._snackbar.open(message, 'Close', {
            verticalPosition: 'bottom',
            duration,
            panelClass: 'snackbar-error'
        });
    }
}
