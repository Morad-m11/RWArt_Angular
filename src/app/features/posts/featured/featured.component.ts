import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';

interface Post {
    id: string;
    author: {
        username: string;
    };
    title: string;
    description: string;
    imageUrl: string;
}

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    featuredPosts = httpResource<Post[]>(() => Endpoints.post.featured);
}
