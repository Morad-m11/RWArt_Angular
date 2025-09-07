import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { NewPost, PostsService } from '../services/posts.service';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [MaterialModule, ImageUploadComponent, LoadingDirective],
    templateUrl: './create-post.component.html',
    styleUrl: './create-post.component.scss'
})
export class CreatePostComponent {
    private readonly _fb = inject(FormBuilder);
    private readonly _router = inject(Router);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _postService = inject(PostsService);

    form = this._fb.nonNullable.group({
        title: ['', Validators.required],
        description: ['', Validators.required],
        image: [null as File | null, Validators.required]
    });

    loading = signal(false);

    setImageFile(file: File | null) {
        this.form.controls.image.setValue(file);
    }

    async submit() {
        this.loading.set(true);

        const post = this.form.getRawValue() as NewPost;

        await this._postService
            .create(post)
            .then(() => this._handleSuccess())
            .catch((error) => {
                this._snackbar.error(`Failed to create post (${error.status})`);
            })
            .finally(() => this.loading.set(false));
    }

    private _handleSuccess(): void {
        this._snackbar.success('Created post');
        this._router.navigate(['posts']);
    }
}
