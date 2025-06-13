import { Routes } from '@angular/router';

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
];
