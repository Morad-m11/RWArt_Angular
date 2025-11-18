import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { CommonModule, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
    booleanAttribute,
    Component,
    computed,
    inject,
    input,
    model,
    output
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { filter, take } from 'rxjs';
import { LoginPromptComponent } from 'src/app/core/services/auth/login-prompt/login-prompt/login-prompt.component';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostMenuComponent } from '../../post/post-menu/post-menu.component';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/post.interface';
import { ImageviewerDialogComponent } from '../imageviewer-dialog/imageviewer-dialog.component';
import { DescriptionComponent } from './description/description.component';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [
        MaterialModule,
        NgOptimizedImage,
        DescriptionComponent,
        TitleCasePipe,
        PostMenuComponent,
        CommonModule
    ],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss'
})
export class PostComponent {
    private readonly _postService = inject(PostsService);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _overlay = inject(Overlay);
    private readonly _dialog = inject(MatDialog);

    imageLoadWidth = input(400);
    imageLoadHeight = input(500);
    showTags = input(false, { transform: booleanAttribute });
    showMenu = input(false, { transform: booleanAttribute });
    showLikes = input(true, { transform: booleanAttribute });
    showUsername = input(true, { transform: booleanAttribute });
    showDescription = input(false, { transform: booleanAttribute });
    post = model.required<Post>();

    deleted = output();

    imageWidthSet = computed(() => `200w, 500w, ${this.imageLoadWidth()}w`);

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
            panelClass: 'dialog-outlined',
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            autoFocus: false
        });
    }

    async deletePost() {
        try {
            await this._postService.delete(this.post().id);
            this.deleted.emit();
        } catch {
            this._snackbar.error('Failed to delete post', 2000);
        }
    }

    async upvote() {
        try {
            await this._postService.upvote(this.post().id);
        } catch (error) {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                this.promptLogin();
            } else {
                this._snackbar.error('Failed to upvote', 2000);
            }
        }
    }

    private syncUpvoteState() {
        this.post.update((post) => ({
            ...post,
            isUpvoted: !this.post().isUpvoted,
            upvoteCount: post.isUpvoted ? post.upvoteCount - 1 : post.upvoteCount + 1
        }));
    }

    async promptLogin(redirect?: string) {
        const overlayRef = this._overlay.create({
            hasBackdrop: true,
            positionStrategy: this._overlay
                .position()
                .global()
                .centerHorizontally()
                .centerVertically()
        });
        const attached = overlayRef.attach(new ComponentPortal(LoginPromptComponent));

        attached.instance.redirect = redirect;
        attached.instance.closed.subscribe(() => overlayRef.detach());
        overlayRef
            .backdropClick()
            .pipe(take(1))
            .subscribe(() => overlayRef.detach());
    }
}
