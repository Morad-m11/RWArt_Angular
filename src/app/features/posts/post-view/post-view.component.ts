import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from '../components/post/post.component';
import { Post } from '../shared/post.interface';

@Component({
    selector: 'app-post-view',
    standalone: true,
    imports: [MaterialModule, PostComponent, IconTextComponent, RouterLink],
    templateUrl: './post-view.component.html',
    styleUrl: './post-view.component.scss'
})
export class PostViewComponent {
    postId = input.required<string>();

    post = httpResource<Post>(() => Endpoints.post.id(this.postId()!));
}
