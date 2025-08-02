import { Routes } from '@angular/router';
import { AuthShellComponent } from './features/auth/shell/auth-shell.component';
import PostsComponent from './features/featured/posts/posts.component';
import FeedbackComponent from './features/feedback/feedback.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFoundComponent } from './shared/components/not-found/not-found/not-found.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'featured' },
    { path: 'featured', component: PostsComponent },
    { path: 'feedback', component: FeedbackComponent },
    {
        path: 'auth',
        component: AuthShellComponent,
        // canMatch: [authRoutesGuard],
        loadChildren: () => import('./features/auth/auth.routes')
    },
    { path: 'profile', component: ProfileComponent },
    { path: '**', pathMatch: 'full', component: NotFoundComponent }
];
