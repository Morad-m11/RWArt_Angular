import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostsService } from '../services/posts.service';
import { CreatePost } from '../shared/post.interface';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { TagsDialogComponent } from './tags-dialog/tags-dialog.component';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [
        MaterialModule,
        FormsModule,
        ImageUploadComponent,
        LoadingDirective,
        IconTextComponent,
        RouterLink
    ],
    templateUrl: './create-post.component.html',
    styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
    private readonly _fb = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _postService = inject(PostsService);
    private readonly _dialog = inject(MatDialog);

    readonly titleMaxLength = 100;
    readonly descriptionMaxLength = 200;

    form = this._fb.nonNullable.group({
        title: ['', [Validators.required, Validators.maxLength(this.titleMaxLength)]],
        description: ['', [Validators.maxLength(this.descriptionMaxLength)]],
        image: [null as File | null, Validators.required],
        tags: [[] as string[]]
    });

    tags = toSignal(this.form.controls.tags.valueChanges, { initialValue: [] });

    loading = signal(false);

    setImageControl(file: File | null) {
        this.form.controls.image.setValue(file);
    }

    async selectTags() {
        const dialogRef = this._dialog.open(TagsDialogComponent, {
            data: { selectedTags: this.form.controls.tags.value }
        });

        const tags = await firstValueFrom<string[] | undefined>(dialogRef.afterClosed());

        if (!tags) {
            return;
        }

        this.form.controls.tags.setValue(tags);
    }

    async submit() {
        try {
            this.loading.set(true);

            const post = this.form.getRawValue() as CreatePost;
            await this._postService.create({ ...post });

            this._snackbar.success('Created post');
            this._router.navigate(['posts']);
        } catch (error) {
            const status = (error as HttpErrorResponse).status;
            this._snackbar.error(`Failed to create post (${status})`);
        } finally {
            this.loading.set(false);
        }
    }
}
