import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { assert } from 'src/app/shared/assert';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormAsyncSuffixComponent } from '../shared/components/form-async-suffix/form-async-suffix.component';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { AsyncUniqueValidator } from '../shared/services/unique.validator';
import { TypedValidatorFn } from '../shared/validation-types';

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
    private readonly _fb = inject(FormBuilder);
    private readonly _uniqueValidator = inject(AsyncUniqueValidator);

    errorMessage = signal('');
    loading = signal(false);

    form = this._fb.nonNullable.group(
        {
            email: [
                '',
                [Validators.required, Validators.email],
                this._uniqueValidator.validate.bind(this._uniqueValidator)
            ],
            username: [
                '',
                Validators.required,
                this._uniqueValidator.validate.bind(this._uniqueValidator)
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
            confirmPassword: ['', Validators.required]
        },
        { validators: passwordMatchValidator }
    );

    signup() {
        throw new Error('Method not implemented');
    }
}

const passwordMatchValidator: TypedValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const passwordConfirm = control.get('confirmPassword');

    assert(password && passwordConfirm, 'Missing one of the password controls');

    const matched = password.value === passwordConfirm.value;

    if (matched) {
        return null;
    }

    passwordConfirm.setErrors({ passwordMatch: true });
    return { passwordMatch: true };
};
