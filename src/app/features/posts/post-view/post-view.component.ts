import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { PostCardComponent } from 'src/app/features/posts/components/post-card/post-card.component';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../shared/post.interface';

@Component({
    selector: 'app-post-view',
    standalone: true,
    imports: [MaterialModule, IconTextComponent, RouterLink, PostCardComponent],
    templateUrl: './post-view.component.html',
    styleUrl: './post-view.component.scss'
})
export class PostViewComponent {
    postId = input.required<string>();

    post = httpResource<Post>(() => Endpoints.post.id(this.postId()!));
}
