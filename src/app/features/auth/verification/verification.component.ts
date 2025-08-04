import { HttpErrorResponse, httpResource, HttpStatusCode } from '@angular/common/http';
import { Component, computed, input } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { ResultCardComponent } from '../shared/components/result-card/result-card.component';
import { VerificationMessages } from '../shared/error-messages';

@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [MaterialModule, ResultCardComponent],
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss'
})
export class VerificationComponent {
    token = input.required<string>();

    errorMessage = computed<string | null>(() =>
        this.verified.error() ? this._getErrorMessage(this.verified.error()!) : null
    );

    verified = httpResource<void>(() => ({
        url: Endpoints.auth.verifyAccount(this.token()),
        method: 'POST'
    }));

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
