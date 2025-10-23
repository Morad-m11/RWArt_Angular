import { Routes } from '@angular/router';
import { authGuard } from 'src/app/shared/guards/auth/auth.guard';
import { PostListComponent } from './components/post-list/post-list.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { idResolver } from './id-resolver/id.resolver';
import { PostViewComponent } from './post-view/post-view.component';

export default [
    {
        path: '',
        component: PostListComponent
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
