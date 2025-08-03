import { HttpErrorResponse, httpResource, HttpStatusCode } from '@angular/common/http';
import { Component, computed, input } from '@angular/core';
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
    token = input<string>();

    errorMessage = computed<string | null>(() =>
        this.verified.error() ? this._getErrorMessage(this.verified.error()!) : null
    );

    verified = httpResource<void>(
        () => `${Endpoints.auth.verifyAccount}/${this.token()}`
    );

    private _getErrorMessage(error: Error): string {
        const status = (error as HttpErrorResponse).status;

        switch (status) {
            case HttpStatusCode.BadRequest:
                return VerificationMessages.invalid;
            case HttpStatusCode.Unauthorized:
                return VerificationMessages.expired;
            default:
                return `${VerificationMessages.failed} (${status})`;
        }
    }
}
