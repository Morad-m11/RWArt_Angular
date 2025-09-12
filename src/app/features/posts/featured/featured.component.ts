import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { ImageviewerDialogComponent } from '../imageviewer-dialog/imageviewer-dialog.component';
import { PostsService } from '../services/posts.service';
import { Post } from '../shared/post.interface';

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    private readonly _dialog = inject(MatDialog);
    private readonly _postService = inject(PostsService);
    private readonly _snackbar = inject(SnackbarService);

    private readonly _featuredCount = 3;

    featuredPosts = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.featured,
            params: { count: this._featuredCount }
        }),
        { defaultValue: [] as Post[] }
    );

    openFullscreenImage(id: string) {
        this._dialog.open(ImageviewerDialogComponent, {
            data: { imageId: id },
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            autoFocus: false
        });
    }

    async upvote(postId: string) {
        try {
            await this._postService.upvote(postId);

            this.featuredPosts.update((posts) => {
                const postIndex = posts.findIndex((post) => post.id === postId);
                posts[postIndex].upvoted = !posts[postIndex].upvoted;
                return [...posts];
            });
        } catch {
            this._snackbar.error('Failed to upvote', 2000);
        }
    }
}
