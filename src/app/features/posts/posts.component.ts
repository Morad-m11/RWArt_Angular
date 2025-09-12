import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from './post/post/post.component';
import { Post } from './shared/post.interface';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, PostComponent],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export default class PostsComponent {
    private readonly _featuredCount = 3;

    featuredPosts = httpResource<Post[]>(() => ({
        url: Endpoints.post.featured,
        params: { count: this._featuredCount }
    }));

    posts = httpResource<Post[]>(() => Endpoints.post.list);
}
