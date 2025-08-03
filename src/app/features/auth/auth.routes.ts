import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { tokenResolver } from './shared/resolvers/token.resolver';
import { SignupComponent } from './signup/signup.component';
import { VerificationComponent } from './verification/verification.component';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
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
] satisfies Routes;
