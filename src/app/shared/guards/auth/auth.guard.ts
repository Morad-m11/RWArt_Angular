import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        const url = router.parseUrl('/auth/login');
        return new RedirectCommand(url);
    }

    return true;
};
