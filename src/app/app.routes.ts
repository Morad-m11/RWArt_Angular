import { Routes } from '@angular/router';
import { AuthShellComponent } from './features/auth/auth-shell/auth-shell.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import PostsComponent from './features/featured/posts/posts.component';
import FeedbackComponent from './features/feedback/feedback.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'posts' },
    { path: 'featured', component: PostsComponent },
    { path: 'feedback', component: FeedbackComponent },
    {
        path: 'auth',
        component: AuthShellComponent,
        children: [
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: 'login', component: LoginComponent },
            { path: 'signup', component: SignupComponent },
            { path: 'forgot', component: SignupComponent },
            { path: '**', pathMatch: 'full', redirectTo: 'login' }
        ]
    },
    { path: 'profile', component: ProfileComponent }
];
