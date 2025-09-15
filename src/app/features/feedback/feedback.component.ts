import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { ResultCardComponent } from '../auth/shared/components/result-card/result-card.component';

@Component({
    selector: 'app-feedback',
    standalone: true,
    imports: [MaterialModule, RouterLink, LoadingDirective, ResultCardComponent],
    templateUrl: './feedback.component.html',
    styleUrl: './feedback.component.scss'
})
export default class FeedbackComponent {
    private readonly _http = inject(HttpClient);
    private readonly _fb = inject(FormBuilder);
    private readonly _authService = inject(AuthService);

    readonly messageMaxLength = 500;

    currentUser = this._authService.currentUser;

    form = this._fb.nonNullable.group({
        name: ['', Validators.required],
        title: ['', Validators.required],
        category: ['', Validators.required],
        message: ['', [Validators.required, Validators.maxLength(500)]]
    });

    errorMessage = signal('');
    loading = signal(false);
    success = signal(false);

    constructor() {
        effect(() => {
            const user = this.currentUser();

            if (user) {
                this.form.controls.name.reset({
                    value: user.username,
                    disabled: true
                });
            }
        });
    }

    async submit() {
        this.errorMessage.set('');
        this.loading.set(true);

        try {
            await firstValueFrom(this._http.post(Endpoints.feedback, this.form.value));
            this.success.set(true);
        } catch (error) {
            const status = (error as HttpErrorResponse).status;

            if (status === HttpStatusCode.TooManyRequests) {
                this.errorMessage.set(
                    'Please wait a few minutes before submitting more feedback'
                );
            } else {
                this.errorMessage.set(`Submission failed (${status})`);
            }
        } finally {
            this.loading.set(false);
        }
    }
}
