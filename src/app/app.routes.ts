import { Routes } from '@angular/router';
import FeedbackComponent from './features/feedback/feedback.component';
import { CreatePostComponent } from './features/posts/create-post/create-post.component';
import PostsComponent from './features/posts/posts.component';
import { NotFoundComponent } from './shared/components/not-found/not-found/not-found.component';
import { authGuard } from './shared/guards/auth/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'posts' },
    {
        path: 'posts',
        children: [
            { path: '', component: PostsComponent },
            {
                path: 'create',
                canMatch: [authGuard],
                component: CreatePostComponent
            }
        ]
    },
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
