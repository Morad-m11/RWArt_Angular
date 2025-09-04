import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';

interface Post {
    id: string;
    title: string;
    author: string;
    imageUrl: string;
}

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export default class PostsComponent {
    featuredPosts = httpResource<Post[]>(() => Endpoints.post.featured);
}
