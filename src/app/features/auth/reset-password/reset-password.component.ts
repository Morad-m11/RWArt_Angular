import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { passwordMatchValidator } from '../shared/validators/password-match/password-match.validator';

@Component({
    selector: 'app-reset-password',
    standalone: true,
    imports: [MaterialModule, FormErrorDirective, LoadingDirective],
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
                    Validators.pattern('[a-zA-Z]*'),
                    Validators.minLength(8),
                    Validators.maxLength(15)
                ]
            ],
            passwordConfirm: [
                '',
                [
                    Validators.required,
                    Validators.pattern('[a-zA-Z]*'),
                    Validators.minLength(8),
                    Validators.maxLength(15)
                ]
            ]
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
            .catch(() => this.errorMessage.set('Failed'))
            .finally(() => this.loading.set(false));
    }
}
