import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { FeaturedComponent } from './components/featured/featured.component';
import { PostListComponent } from './components/post-list/post-list.component';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, RouterLink, FeaturedComponent, PostListComponent],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent {}
