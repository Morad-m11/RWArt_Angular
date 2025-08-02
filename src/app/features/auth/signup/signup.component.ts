import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { omit } from 'src/app/shared/omit';
import { UserService } from 'src/app/shared/services/user/user.service';
import { FormAsyncSuffixComponent } from '../shared/components/form-async-suffix/form-async-suffix.component';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { SignupSnackbarMessages } from '../shared/messages';
import { passwordMatchValidator } from '../shared/validators/password-match/password-match.validator';
import { AsyncUniqueUserValidator } from '../shared/validators/unique/unique-user.validator';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        LoadingDirective,
        FormErrorDirective,
        FormAsyncSuffixComponent
    ],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss'
})
export class SignupComponent {
    private readonly _authService = inject(AuthService);
    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);
    private readonly _fb = inject(FormBuilder);

    errorMessage = signal('');
    loading = signal(false);

    form = this._fb.nonNullable.group(
        {
            email: [
                '',
                [Validators.required, Validators.email],
                AsyncUniqueUserValidator(this._userService, 'email')
            ],
            username: [
                '',
                Validators.required,
                AsyncUniqueUserValidator(this._userService, 'username')
            ],
            password: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z]*'),
                    Validators.minLength(8),
                    Validators.maxLength(15)
                ]
            ],
            passwordConfirm: ['', Validators.required]
        },
        { validators: passwordMatchValidator }
    );

    async signup() {
        this.errorMessage.set('');

        const body = omit(this.form.getRawValue(), 'passwordConfirm');

        await this._authService
            .signup(body)
            .then(() => this._handleSuccess())
            .catch((error) => this._handleError(error));
    }

    private _handleSuccess() {
        this._router.navigate(['/', 'auth', 'verify']);
    }

    private _handleError(error: HttpErrorResponse) {
        this.errorMessage.set(`${SignupSnackbarMessages.failed} (${error.status})`);
    }
}
