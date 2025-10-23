import { Component, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/post.interface';

@Component({
    selector: 'app-post-menu',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './post-menu.component.html',
    styleUrl: './post-menu.component.scss'
})
export class PostMenuComponent {
    private readonly _dialog = inject(MatDialog);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _postService = inject(PostsService);

    post = input.required<Post>();
    deleteClicked = output();

    async delete() {
        const dialogRef = this._dialog.open(ConfirmDialogComponent);
        const confirmed = await firstValueFrom(dialogRef.afterClosed());

        if (!confirmed) {
            return;
        }

        this.deleteClicked.emit();
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
