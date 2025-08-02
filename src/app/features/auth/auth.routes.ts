import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { verificationTokenResolver } from './shared/resolvers/verification.resolver';
import { SignupComponent } from './signup/signup.component';
import { VerificationComponent } from './verification/verification.component';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'login' },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'recovery', component: RecoveryComponent },
    {
        path: 'verify',
        component: VerificationComponent,
        resolve: { token: verificationTokenResolver }
    }
] satisfies Routes;
