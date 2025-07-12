import { Routes } from '@angular/router';
import PostsComponent from './features/featured/posts/posts.component';
import FeedbackComponent from './features/feedback/feedback.component';
import { LoginComponent } from './features/login/login.component';
import { ProfileComponent } from './features/profile/profile.component';

export const routes: Routes = [
   { path: '', pathMatch: 'full', redirectTo: 'posts' },
   { path: 'featured', component: PostsComponent },
   { path: 'feedback', component: FeedbackComponent },
   { path: 'login', component: LoginComponent },
   { path: 'profile', component: ProfileComponent }
];
