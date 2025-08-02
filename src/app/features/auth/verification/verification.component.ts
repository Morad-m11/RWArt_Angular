import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { Endpoints } from 'src/app/core/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { VerificationMessages } from './messages';

@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss'
})
export class VerificationComponent {
    private readonly _http = inject(HttpClient);

    token = input<string>();

    verificationResult = toSignal<string>(
        toObservable(this.token).pipe(
            filter((token) => !!token),
            switchMap((token) => this._verifyToken(token!)),
            map(() => VerificationMessages.success),
            catchError((error) => of(this._getErrorMessage(error)))
        )
    );

    private _verifyToken(params: string): Observable<unknown> {
        return this._http.post(Endpoints.auth.verify, { token: params });
    }

    private _getErrorMessage(error: HttpErrorResponse): string {
        switch (error.status) {
            case HttpStatusCode.BadRequest:
                return VerificationMessages.invalid;
            case HttpStatusCode.Unauthorized:
                return VerificationMessages.expired;
            default:
                return `${VerificationMessages.failed} (${error.status})`;
        }
    }
}
