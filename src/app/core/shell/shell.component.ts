import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { TypingDirective } from 'src/app/shared/directives/typing/typing.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { Endpoints } from '../constants/api-endpoints';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
    imports: [
        MaterialModule,
        RouterLink,
        IconTextComponent,
        OverlayModule,
        MatInputModule,
        TypingDirective,
        FormsModule
    ]
})
export class ShellComponent {
    private readonly _http = inject(HttpClient);

    feedback = '';

    loading = signal(false);

    errorCode = signal<number | null>(null);
    sentFeedback = signal(false);
    sendButtonText = computed(() => {
        if (this.errorCode()) {
            return `Failed to send! (${this.errorCode()})`;
        }

        if (this.loading()) {
            return 'Sending...';
        }

        if (this.sentFeedback()) {
            return 'Thanks!';
        }

        return 'Send feedback';
    });

    async sendFeedback() {
        if (this.sentFeedback()) {
            return;
        }

        this.errorCode.set(null);
        this.loading.set(true);

        try {
            await firstValueFrom(
                this._http.post(Endpoints.feedback, { message: this.feedback })
            );
            this.sentFeedback.set(true);
        } catch (error) {
            this.errorCode.set((error as HttpErrorResponse).status);
        } finally {
            this.loading.set(false);
        }
    }

    private readonly _breakpointObserver = inject(BreakpointObserver);

    isHandset = toSignal(
        this._breakpointObserver
            .observe(Breakpoints.XSmall)
            .pipe(map((result) => result.matches))
    );

    isOpen = false;
}
