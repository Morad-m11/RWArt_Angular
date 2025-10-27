import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostComponent } from 'src/app/features/posts/components/post/post.component';
import { PostMenuComponent } from 'src/app/features/posts/post/post-menu/post-menu.component';
import { Post } from 'src/app/features/posts/shared/post.interface';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-post-card',
    standalone: true,
    imports: [MaterialModule, RouterLink, PostComponent, PostMenuComponent],
    templateUrl: './post-card.component.html',
    styleUrl: './post-card.component.scss'
})
export class PostCardComponent {
    post = input.required<Post>();
}
