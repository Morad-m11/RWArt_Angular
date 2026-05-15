import { Routes } from '@angular/router';
import FeedbackComponent from './features/feedback/feedback.component';
import { PrivacyPolicyComponent } from './features/legal/privacy/privacy.component';
import { TosComponent } from './features/legal/tos/tos.component';
import postRoutes from './features/posts/post.routes';
import { PostsComponent } from './features/posts/posts.component';
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
        path: 'posts',
        component: PostsComponent
    },
    ...postRoutes,
    {
        path: 'user/:username',
        loadComponent: () => import('./features/profile/profile.component'),
        resolve: { username: usernameResolver }
    },
    {
        path: 'feedback',
        component: FeedbackComponent
    },
    {
        path: 'privacy',
        component: PrivacyPolicyComponent
    },
    {
        path: 'terms',
        component: TosComponent
    },
    {
        path: '**',
        pathMatch: 'full',
        component: NotFoundComponent
    }
];
