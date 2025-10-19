import { NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, model, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { filter, firstValueFrom } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/post.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ImageviewerDialogComponent } from '../imageviewer-dialog/imageviewer-dialog.component';
import { DescriptionComponent } from './description/description.component';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage, DescriptionComponent, TitleCasePipe],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss'
})
export class PostComponent {
    private readonly _postService = inject(PostsService);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _dialog = inject(MatDialog);

    readonly imageLoadWidth = 400;
    readonly imageLoadHeight = 500;

    post = model.required<Post>();
    deleted = output();

    constructor() {
        this._postService.upvoted$
            .pipe(
                takeUntilDestroyed(),
                filter(({ postId }) => postId === this.post().id)
            )
            .subscribe(() => this.syncUpvoteState());
    }

    openFullscreen() {
        this._dialog.open(ImageviewerDialogComponent, {
            data: { post: this.post() },
            hasBackdrop: true,
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
        } catch {
            this._snackbar.error('Failed to upvote', 2000);
        }
    }

    private syncUpvoteState() {
        this.post.update((post) => ({
            ...post,
            isUpvoted: !this.post().isUpvoted,
            upvoteCount: post.isUpvoted ? post.upvoteCount - 1 : post.upvoteCount + 1
        }));
    }

    async shareLink() {
        await this._evokeShareAPI({
            title: this.post().title,
            url: `${window.location.origin}/posts/${this.post().id}`
        });
    }

    async shareImg(url: string) {
        try {
            const blob = await this._postService.fetchImageBlob(url);
            const file = new File([blob], this.post().title);
            await this._evokeShareAPI({ title: this.post().title, url, file });
        } catch {
            this._snackbar.error(`Failed to share image from ${url}`);
        }
    }

    async download(url: string) {
        try {
            const blob = await this._postService.fetchImageBlob(url);
            this._downloadBlob(blob);
        } catch {
            this._snackbar.error(`Failed to fetch image from ${url}`);
        }
    }

    async delete() {
        const dialogRef = this._dialog.open(ConfirmDialogComponent);
        const confirmed = await firstValueFrom(dialogRef.afterClosed());

        if (!confirmed) {
            return;
        }

        try {
            await this._postService.delete(this.post().id);
            this.deleted.emit();
            this._snackbar.success('Deleted post');
        } catch (error) {
            const status = (error as HttpErrorResponse).status;
            this._snackbar.error(`Could not delete post (${status})`);
        }
    }

    private _downloadBlob(blob: Blob) {
        // create temporary link
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = this.post().title;

        // Trigger download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        URL.revokeObjectURL(objectUrl);
    }

    private async _evokeShareAPI(data: { title: string; url: string; file?: File }) {
        try {
            const shareData: ShareData = {
                title: data.title,
                url: data.url,
                files: data.file && [data.file]
            };

            const canShare =
                typeof navigator.canShare === 'function' && navigator.canShare(shareData);

            if (!canShare) {
                await navigator.clipboard.writeText(data.url);
                this._snackbar.success('Copied to Clipboard!');
                return;
            }

            await navigator.share(shareData);
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                return;
            }

            console.error(error);
            this._snackbar.error(`Sharing failed. ${error}`);
        }
    }
}
