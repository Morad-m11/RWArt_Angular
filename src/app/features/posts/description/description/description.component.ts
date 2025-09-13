import { Component, inject, model, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/post.interface';

@Component({
    selector: 'app-description',
    standalone: true,
    imports: [MaterialModule, RouterLink],
    templateUrl: './description.component.html',
    styleUrl: './description.component.scss'
})
export class DescriptionComponent {
    private readonly _postService = inject(PostsService);
    private readonly _snackbar = inject(SnackbarService);

    post = model.required<Post>();

    isExpanded = signal(false);

    async upvote() {
        try {
            await this._postService.upvote(this.post().id);

            this.post.update((post) => ({
                ...post,
                upvoted: !this.post().upvoted,
                upvoteCount: post.upvoted ? post.upvoteCount - 1 : post.upvoteCount + 1
            }));
        } catch {
            this._snackbar.error('Failed to upvote', 2000);
        }
    }

    toggleExpand() {
        this.isExpanded.update((x) => !x);
    }
}
