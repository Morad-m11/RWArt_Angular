import { Routes } from '@angular/router';
import { authRoutesGuard } from 'src/app/features/auth/shared/guards/auth-routes.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { redirectResolver } from './login/redirect-resolver/redirect.resolver';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { tokenResolver } from './shared/resolvers/token.resolver';
import { AuthShellComponent } from './shell/auth-shell.component';
import { SignupComponent } from './signup/signup.component';
import { VerificationComponent } from './verification/verification.component';

export default [
    {
        path: '',
        component: AuthShellComponent,
        canMatch: [authRoutesGuard],
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            {
                path: 'login',
                component: LoginComponent,
                resolve: { redirectUrl: redirectResolver }
            },
            {
                path: 'signup',
                component: SignupComponent
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            },
            {
                path: 'reset-password/:token',
                component: ResetPasswordComponent,
                resolve: { token: tokenResolver }
            },
            {
                path: 'verify-account/:token',
                component: VerificationComponent,
                resolve: { token: tokenResolver }
            }
        ]
    }
] satisfies Routes;
