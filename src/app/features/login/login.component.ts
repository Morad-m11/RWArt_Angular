import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';

export interface Credentials {
    username: string;
    password: string;
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [MaterialModule, LoadingDirective],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private readonly _snackbar = inject(SnackbarService);
    private readonly _authService = inject(AuthService);
    private readonly _fb = inject(FormBuilder);

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
            .login(user)
            .then(() => this._snackbar.success(`Welcome ${user.username}`))
            .catch((error: HttpErrorResponse) => this._handleError(error))
            .finally(() => this.loading.set(false));
    }

    private _handleError(error: HttpErrorResponse): void {
        if (error.status === HttpStatusCode.Unauthorized) {
            this.errorMessage.set('Invalid username/password');
            return;
        }

        this.errorMessage.set(`Login failed (${error.status})`);
    }
}
