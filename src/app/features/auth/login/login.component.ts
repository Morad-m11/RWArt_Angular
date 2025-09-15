import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService, SignInProvider } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { getErrorMessage } from '../shared/error-messages';
import { GoogleButtonComponent } from './google-button/google-button.component';
import { UsernamePickerComponent } from './username-picker/username-picker/username-picker.component';

export interface Credentials {
    username: string;
    password: string;
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        LoadingDirective,
        FormErrorDirective,
        GoogleButtonComponent
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private readonly _fb = inject(FormBuilder);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _dialog = inject(MatDialog);
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);

    form = this._fb.nonNullable.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
    });

    loading = signal(false);
    errorMessage = signal('');
    loadingVerification = signal(false);
    showResendVerification = signal(false);

    redirectUrl = input<string | null>(null);

    async login() {
        this.loading.set(true);
        this.errorMessage.set('');
        this.showResendVerification.set(false);

        const user = this.form.getRawValue();

        await this._authService
            .login(user.username, user.password)
            .then(() => this._handleSuccess())
            .catch((error) => this._setErrorMessage(error))
            .finally(() => this.loading.set(false));
    }

    async handleThirdPartySignIn($event: { provider: SignInProvider; token: string }) {
        this.loading.set(true);
        this.errorMessage.set('');
        this.showResendVerification.set(false);

        await this._authService
            .thirdPartyLogin($event.provider, $event.token)
            .then(() => this._handleSuccess())
            .catch(async (error: HttpErrorResponse) => {
                if (error.status !== HttpStatusCode.Conflict) {
                    this._setErrorMessage(error);
                    return;
                }

                const username = await this._pickUserName();

                if (!username) {
                    return;
                }

                await this._authService
                    .thirdPartyLogin($event.provider, $event.token, username)
                    .then(() => this._handleSuccess())
                    .catch((error: HttpErrorResponse) => {
                        this._setErrorMessage(error);
                    });
            })
            .finally(() => {
                this.loading.set(false);
            });
    }

    async _pickUserName(): Promise<string | null | undefined> {
        const dialogRef = this._dialog.open<
            UsernamePickerComponent,
            undefined,
            string | null
        >(UsernamePickerComponent, { disableClose: true });

        return await firstValueFrom(dialogRef.afterClosed());
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

    private _handleSuccess(): void {
        this._snackbar.success('Logged in');
        this._router.navigateByUrl(this.redirectUrl() ?? '/');
    }

    private _setErrorMessage(error: HttpErrorResponse): void {
        const isUnverified = error.status === HttpStatusCode.Forbidden;
        const message = getErrorMessage('login', error);

        if (isUnverified) {
            this.showResendVerification.set(true);
        }

        this.errorMessage.set(message);
    }
}
