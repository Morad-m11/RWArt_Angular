import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormErrorDirective } from '../shared/directives/form-error/form-error.directive';
import { RecoveryMessages } from './messages';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [MaterialModule, FormErrorDirective, LoadingDirective],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
    private readonly _authService = inject(AuthService);

    email = new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
    });

    errorMessage = signal('');
    loading = signal(false);
    success = signal(false);

    async submit() {
        this.errorMessage.set('');
        this.loading.set(true);

        await this._authService
            .recoverAccount(this.email.value)
            .then(() => this.success.set(true))
            .catch((error: HttpErrorResponse) =>
                this.errorMessage.set(`${RecoveryMessages.failed} (${error.status})`)
            )
            .finally(() => this.loading.set(false));
    }
}
