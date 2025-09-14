import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { DescriptionComponent } from '../description/description/description.component';
import { ImageviewerDialogComponent } from '../imageviewer-dialog/imageviewer-dialog.component';
import { PostsService } from '../services/posts.service';
import { Post } from '../shared/post.interface';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage, DescriptionComponent],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss'
})
export class PostComponent {
    private readonly _postService = inject(PostsService);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _dialog = inject(MatDialog);

    post = input.required<Post>();
    height = input.required({ transform: coerceCssPixelValue });
    width = input('100%', { transform: coerceCssPixelValue });

    deleted = output();

    openFullscreen() {
        this._dialog.open(ImageviewerDialogComponent, {
            data: { post: this.post() },
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            autoFocus: false
        });
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
}
