import { Routes } from '@angular/router';
import { authGuard } from 'src/app/shared/guards/auth/auth.guard';
import { CreatePostComponent } from './create-post/create-post.component';
import { idResolver } from './id-resolver/id.resolver';
import { PostViewComponent } from './post-view/post-view.component';
import { PostsComponent } from './posts.component';

export default [
    {
        path: '',
        component: PostsComponent
    },
    {
        path: 'create',
        canActivate: [authGuard],
        component: CreatePostComponent
    },
    {
        path: ':id',
        component: PostViewComponent,
        resolve: { postId: idResolver }
    }
] satisfies Routes;
