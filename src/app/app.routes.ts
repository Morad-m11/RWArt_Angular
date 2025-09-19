import { Routes } from '@angular/router';
import FeedbackComponent from './features/feedback/feedback.component';
import postRoutes from './features/posts/post.routes';
import { usernameResolver } from './features/profile/resolver/profile.resolver';
import { NotFoundComponent } from './shared/components/not-found/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'posts'
    },
    {
        path: 'auth',
        loadChildren: () => import('./features/auth/auth.routes')
    },
    {
        path: 'user/:username',
        loadComponent: () => import('./features/profile/profile.component'),
        resolve: { username: usernameResolver }
    },
    {
        path: 'posts',
        children: postRoutes
    },
    {
        path: 'feedback',
        component: FeedbackComponent
    },
    {
        path: '**',
        pathMatch: 'full',
        component: NotFoundComponent
    }
];
