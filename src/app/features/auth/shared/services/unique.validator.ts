import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AbstractControl, AsyncValidator } from '@angular/forms';
import { Observable, catchError, map, of, switchMap, timer } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';
import { TypedValidationErrors } from '../validation-types';

export const ASYNC_VALIDATION_DELAY = 500;

@Injectable({ providedIn: 'root' })
export class AsyncUniqueValidator implements AsyncValidator {
    private readonly userService = inject(UserService);

    private _previousValue?: string;

    validate(control: AbstractControl<string>): Observable<TypedValidationErrors | null> {
        // this function needs custom debounce & distinct logic
        // because a new observable is created on each value change
        return timer(ASYNC_VALIDATION_DELAY).pipe(
            switchMap(() => this._requestIfChanged(control.value)),
            map((unique) => (unique ? null : { unique: false })),
            catchError((error: HttpErrorResponse) => of({ serverCheck: error.status }))
        );
    }

    private _requestIfChanged(value: string): Observable<boolean> {
        if (value === this._previousValue) {
            return of(false);
        }

        this._previousValue = value;

        return this.userService.isUnique(value);
    }
}
