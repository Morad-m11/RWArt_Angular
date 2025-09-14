import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from './post/post.component';
import { Post } from './shared/post.interface';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, RouterLink, PostComponent],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export default class PostsComponent {
    featuredPosts = httpResource<Post[]>(() => ({
        url: Endpoints.post.featured,
        params: { limit: 3 }
    }));

    posts = httpResource<Post[]>(() => Endpoints.post.base);

    refresh() {
        this.featuredPosts.reload();
        this.posts.reload();
    }
}
