import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginPromptDialogComponent } from 'src/app/core/services/auth/login-prompt/login-prompt-dialog/login-prompt-dialog.component';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        const targetUrl = state.url;
        await promptLogin(targetUrl);
        return false;
    }

    return true;
};

async function promptLogin(redirect?: string) {
    const dialogRef = inject(MatDialog).open(LoginPromptDialogComponent, {
        data: { redirect },
        panelClass: 'dialog-outlined',
        autoFocus: false
    });

    return await firstValueFrom(dialogRef.afterClosed());
}
