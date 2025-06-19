import { Routes } from '@angular/router';
import { LoginComponent } from './auth/user/login.component';

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
   { path: 'login', component: LoginComponent },
];
