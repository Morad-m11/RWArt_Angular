import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { UserService } from 'src/app/shared/services/user/user.service';
import { FormAsyncSuffixComponent } from '../shared/components/form-async-suffix/form-async-suffix.component';
import { ResultCardComponent } from '../shared/components/result-card/result-card.component';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { getErrorMessage } from '../shared/error-messages';
import { SignInProviderInfo } from '../shared/signin-provider-type';
import { hasNumberValidator } from '../shared/validators/has-number/has-number.validator';
import { asyncUniqueUserValidator } from '../shared/validators/unique/unique-user.validator';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        LoadingDirective,
        FormErrorDirective,
        FormAsyncSuffixComponent,
        ResultCardComponent
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    private readonly _authService = inject(AuthService);
    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);
    private readonly _fb = inject(FormBuilder);

    thirdParty = input<SignInProviderInfo>();

    errorMessage = signal('');
    loading = signal(false);
    success = signal(false);

    form = this._fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        username: [
            '',
            Validators.required,
            asyncUniqueUserValidator(this._userService, 'username')
        ],
        password: [
            '',
            [
                Validators.required,
                Validators.minLength(8),
                Validators.maxLength(64),
                hasNumberValidator
            ]
        ]
    });

    async signup() {
        this.loading.set(true);
        this.success.set(false);
        this.errorMessage.set('');

        if (this.thirdParty()) {
            const { provider, token } = this.thirdParty()!;
            const username = this.form.controls.username.value;

            await this._authService
                .thirdPartyLogin(provider, token, username)
                .then(() => this._router.navigate(['/']))
                .catch((error: HttpErrorResponse) => {
                    this._setErrorMessage(error);
                });
        } else {
            await this._authService
                .signup(this.form.getRawValue())
                .then(() => this.success.set(true))
                .catch((error) => this._setErrorMessage(error))
                .finally(() => this.loading.set(false));
        }
    }

    private _setErrorMessage(error: HttpErrorResponse) {
        this.errorMessage.set(getErrorMessage('signup', error));
    }
}
