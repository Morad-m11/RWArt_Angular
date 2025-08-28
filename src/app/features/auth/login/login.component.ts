import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CoreSnackbarMessages } from 'src/app/core/constants/snackbar-messages';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { getErrorMessage } from '../shared/error-messages';

export interface Credentials {
    username: string;
    password: string;
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [MaterialModule, RouterLink, LoadingDirective, FormErrorDirective],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private readonly _authService = inject(AuthService);
    private readonly _fb = inject(FormBuilder);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _router = inject(Router);

    form = this._fb.nonNullable.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    loading = signal(false);
    errorMessage = signal('');
    loadingVerification = signal(false);
    showResendVerification = signal(false);

    async login() {
        this.loading.set(true);
        this.errorMessage.set('');
        this.showResendVerification.set(false);

        const user = this.form.getRawValue();

        await this._authService
            .login(user.username, user.password)
            .then(() => this._handleSuccess(user.username))
            .catch((error) => this._setErrorMessage(error))
            .finally(() => this.loading.set(false));
    }

    async resendAccountVerification() {
        this.loadingVerification.set(true);

        const username = this.form.getRawValue().username;

        await this._authService
            .resendVerification(username)
            .then(() => {
                this._snackbar.success('Sent verification mail', 3000);
                this.errorMessage.set('');
            })
            .catch((error) => this._setErrorMessage(error))
            .finally(() => this.loadingVerification.set(false));
    }

    private _handleSuccess(name: string): void {
        this._snackbar.success(`${CoreSnackbarMessages.login.success} ${name}`);
        this._router.navigateByUrl('/');
    }

    private _setErrorMessage(error: HttpErrorResponse): void {
        if (error.status === 403) {
            this.showResendVerification.set(true);
        }

        this.errorMessage.set(getErrorMessage('login', error.status));
    }
}
