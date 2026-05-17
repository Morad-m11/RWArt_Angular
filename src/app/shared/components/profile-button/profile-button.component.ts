import { Menu, MenuContent, MenuItem, MenuTrigger } from '@angular/aria/menu';
import { OverlayModule } from '@angular/cdk/overlay';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CoreSnackbarMessages } from 'src/app/core/constants/snackbar-messages';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { MaterialModule } from '../../material.module';
import { IconTextComponent } from '../icon-text/icon-text.component';

@Component({
    selector: 'app-profile-button',
    standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        OverlayModule,
        IconTextComponent,
        Menu,
        MenuContent,
        MenuItem,
        MenuTrigger
    ],
    templateUrl: './profile-button.component.html',
    styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {
    private readonly _authService = inject(AuthService);
    private readonly _snackbar = inject(SnackbarService);

    profile = this._authService.userProfile;

    isOpen = signal(false);

    formatMenu = viewChild<Menu<string>>('formatMenu');

    async logout() {
        await this._authService
            .logout()
            .then(() => this._handleSuccess())
            .catch((error: HttpErrorResponse) => {
                this._snackbar.error(
                    `${CoreSnackbarMessages.logout.failed} ${error.status}`
                );
            });
    }

    private _handleSuccess(): void {
        window.location.reload();
    }
}
