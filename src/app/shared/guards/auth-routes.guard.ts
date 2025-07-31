import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

export const authRoutesGuard: CanMatchFn = () => {
    const authService = inject(AuthService);
    return !authService.loggedIn();
};
