import { NgOptimizedImage } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { ImageviewerDialogComponent } from '../../imageviewer-dialog/imageviewer-dialog.component';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/post.interface';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss'
})
export class PostComponent {
    private readonly _postService = inject(PostsService);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _dialog = inject(MatDialog);

    post = model.required<Post>();

    openFullscreen() {
        this._dialog.open(ImageviewerDialogComponent, {
            data: { imageId: this.post().imageId },
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            autoFocus: false
        });
    }

    async upvote() {
        try {
            await this._postService.upvote(this.post().id);
            this.post.update((post) => ({ ...post, upvoted: !this.post().upvoted }));
        } catch {
            this._snackbar.error('Failed to upvote', 2000);
        }
    }
}
