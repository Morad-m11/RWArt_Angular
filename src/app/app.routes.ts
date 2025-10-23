import { Routes } from '@angular/router';
import FeedbackComponent from './features/feedback/feedback.component';
import { PrivacyPolicyComponent } from './features/legal/privacy/privacy.component';
import { TosComponent } from './features/legal/tos/tos.component';
import { FeaturedComponent } from './features/posts/components/featured/featured.component';
import postRoutes from './features/posts/post.routes';
import { PostsComponent } from './features/posts/posts.component';
import { usernameResolver } from './features/profile/resolver/profile.resolver';
import { NotFoundComponent } from './shared/components/not-found/not-found/not-found.component';

export const routes: Routes = [
    {
        path: '',
        component: PostsComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'featured'
            },
            {
                path: 'featured',
                component: FeaturedComponent
            },
            {
                path: 'posts',
                children: postRoutes
            }
        ]
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
