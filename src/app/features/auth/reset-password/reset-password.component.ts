import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { ResultCardComponent } from '../shared/components/result-card/result-card.component';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { getErrorMessage } from '../shared/error-messages';
import { hasNumberValidator } from '../shared/validators/has-number/has-number.validator';
import { passwordMatchValidator } from '../shared/validators/password-match/password-match.validator';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [MaterialModule, ResultCardComponent, FormErrorDirective, LoadingDirective],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
    private readonly _authService = inject(AuthService);
    private readonly _fb = inject(FormBuilder);

    token = input.required<string>();

    loading = signal(false);
    success = signal(false);
    errorMessage = signal('');

    form = this._fb.nonNullable.group(
        {
            password: [
                '',
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(64),
                    hasNumberValidator
                ]
            ],
            passwordConfirm: ['', Validators.required]
        },
        { validators: passwordMatchValidator }
    );

    async submit() {
        this.loading.set(false);
        this.success.set(false);
        this.errorMessage.set('');

        await this._authService
            .resetPassword(this.form.controls.password.value, this.token())
            .then(() => this.success.set(true))
            .catch((error) => this._setErrorMessage(error))
            .finally(() => this.loading.set(false));
    }

    private _setErrorMessage(error: HttpErrorResponse): void | PromiseLike<void> {
        this.errorMessage.set(getErrorMessage('forgotPassword', error));
    }
}
