import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoginPromptComponent } from 'src/app/core/services/auth/login-prompt/login-prompt/login-prompt.component';

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);

    if (!authService.isLoggedIn()) {
        const targetUrl = state.url;
        promptLogin(targetUrl);
        return false;
    }

    return true;
};

async function promptLogin(redirect?: string) {
    const overlay = inject(Overlay);
    const overlayRef = overlay.create({
        hasBackdrop: true,
        positionStrategy: overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically()
    });
    const attached = overlayRef.attach(new ComponentPortal(LoginPromptComponent));

    attached.instance.redirect = redirect;
    attached.instance.closed.subscribe(() => overlayRef.detach());
    overlayRef
        .backdropClick()
        .pipe(take(1))
        .subscribe(() => overlayRef.detach());
}
