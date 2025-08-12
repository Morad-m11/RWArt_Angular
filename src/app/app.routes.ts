import { Routes } from '@angular/router';
import PostsComponent from './features/featured/posts/posts.component';
import FeedbackComponent from './features/feedback/feedback.component';
import { NotFoundComponent } from './shared/components/not-found/not-found/not-found.component';
import { authGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'featured' },
    { path: 'featured', component: PostsComponent },
    { path: 'feedback', component: FeedbackComponent },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes')
    },
    {
        path: 'profile',
        canMatch: [authGuard],
        loadComponent: () => import('./features/profile/profile.component')
    },
    { path: '**', pathMatch: 'full', component: NotFoundComponent }
];
