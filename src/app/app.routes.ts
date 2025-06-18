import { Routes } from '@angular/router';
import { UserComponent } from './auth/user/user.component';

export const routes: Routes = [
   { path: '', pathMatch: 'full', redirectTo: 'posts' },
   {
      path: 'posts',
      loadComponent: () => import('./posts/posts.component'),
   },
   {
      path: 'feedback',
      loadComponent: () => import('./feedback/feedback.component'),
   },
   { path: 'user', component: UserComponent },
];
