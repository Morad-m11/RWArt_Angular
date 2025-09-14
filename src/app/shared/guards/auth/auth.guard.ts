import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        authService.promptLogin();
        return false;
    }

    return true;
};
