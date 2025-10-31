import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanActivateFn } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginPromptDialogComponent } from 'src/app/core/services/auth/login-prompt/login-prompt-dialog/login-prompt-dialog.component';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        await promptLogin();
        return false;
    }

    return true;
};

async function promptLogin() {
    const dialogRef = inject(MatDialog).open(LoginPromptDialogComponent);
    return await firstValueFrom(dialogRef.afterClosed());
}
