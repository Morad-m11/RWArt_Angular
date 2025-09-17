import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { NewPost, PostsService } from '../services/posts.service';
import { ImageUploadComponent } from './image-upload/image-upload.component';

@Component({
    selector: 'app-create-post',
    standalone: true,
    imports: [MaterialModule, FormsModule, ImageUploadComponent, LoadingDirective],
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
        image: [null as File | null, Validators.required],
        tags: [[] as string[]]
    });

    selectedTags = signal<string[]>([]);
    customTags = signal<string[]>([]);
    loading = signal(false);

    setImageControl(file: File | null) {
        this.form.controls.image.setValue(file);
    }

    onTagSelect(tags: string[]) {
        this.selectedTags.set(tags);
    }

    addCustomTag(event: MatChipInputEvent) {
        if (this.customTags().length >= 3) {
            return;
        }

        const value = event.value.trim();

        if (value) {
            this.customTags.update((x) => [...x, value]);
        }

        event.chipInput.clear();
    }

    removeCustomTag(tag: string) {
        this.customTags.update((value) => {
            const index = value.indexOf(tag);

            if (index < 0) {
                return value;
            }

            value.splice(index, 1);
            return [...value];
        });
    }

    async submit() {
        const otherTagsSelected = this.selectedTags().includes('other');

        this.form.controls.tags.setValue([
            ...this.selectedTags().filter((x) => x !== 'other'),
            ...(otherTagsSelected ? this.customTags() : [])
        ]);

        try {
            this.loading.set(true);

            const post = this.form.getRawValue() as NewPost;
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
