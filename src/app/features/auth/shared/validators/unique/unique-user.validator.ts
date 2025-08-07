import { HttpErrorResponse } from '@angular/common/http';
import { AsyncValidatorFn } from '@angular/forms';
import { Observable, catchError, map, of, switchMap, tap, timer } from 'rxjs';
import { UserService } from 'src/app/shared/services/user/user.service';

export const ASYNC_VALIDATION_DELAY = 500;

type AsyncValidatorFnWrapper = (
    service: UserService,
    controlName: 'username' | 'email'
) => AsyncValidatorFn;

export const asyncUniqueUserValidator: AsyncValidatorFnWrapper = (
    service,
    controlName
) => {
    let previousValue: string | undefined;
    let previousResult: boolean;

    return (control) => {
        // this function needs custom debounce & distinct logic
        // because a new observable is created on each value change
        return timer(ASYNC_VALIDATION_DELAY).pipe(
            switchMap(() => requestChangedValue(control.value)),
            tap((result) => (previousResult = result)),
            map((unique) => (unique ? null : { unique: false })),
            catchError((error: HttpErrorResponse) => of({ serverCheck: error.status }))
        );
    };

    function requestChangedValue(value: string): Observable<boolean> {
        if (value === previousValue) {
            return of(previousResult);
        }

        previousValue = value;

        return service.isUnique({ [controlName]: value });
    }
};
