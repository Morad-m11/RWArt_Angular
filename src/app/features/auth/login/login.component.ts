import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CoreSnackbarMessages } from 'src/app/core/constants/snackbar-messages';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { LoginSnackbarMessages } from '../shared/error-messages';

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

    async login() {
        this.loading.set(true);
        this.errorMessage.set('');

        const user = this.form.getRawValue();

        await this._authService
            .login(user.username, user.password)
            .then(() => this._handleSuccess(user.username))
            .catch((error) => this._handleError(error))
            .finally(() => this.loading.set(false));
    }

    private _handleSuccess(name: string): void {
        this._snackbar.success(`${CoreSnackbarMessages.login.success} ${name}`);
        this._router.navigateByUrl('/');
    }

    private _handleError(error: HttpErrorResponse): void {
        switch (error.status) {
            case HttpStatusCode.Unauthorized:
                this.errorMessage.set(LoginSnackbarMessages.unauthorized);
                break;
            case HttpStatusCode.Forbidden:
                this.errorMessage.set(LoginSnackbarMessages.unverified);
                break;
            default:
                this.errorMessage.set(
                    `${LoginSnackbarMessages.failed} (${error.status})`
                );
        }
    }
}
