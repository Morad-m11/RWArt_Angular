import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostsService } from '../services/posts.service';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [MaterialModule],
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
        imageUrl: ['', Validators.required]
    });

    async submit() {
        await this._postService
            .create(this.form.getRawValue())
            .then(() => this._handleSuccess())
            .catch((error) => {
                this._snackbar.error(`Failed to create post (${error.status})`);
            });
    }

    private _handleSuccess(): void {
        this._snackbar.success('Created post');
        this._router.navigate(['posts']);
    }
}
