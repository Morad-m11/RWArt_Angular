import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

export const authRoutesGuard: CanMatchFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        return true;
    }

    const url = router.parseUrl('/');
    return new RedirectCommand(url);
};
