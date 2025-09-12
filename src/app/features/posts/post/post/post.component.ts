import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/shared/material.module';
import { DescriptionComponent } from '../../description/description/description.component';
import { ImageviewerDialogComponent } from '../../imageviewer-dialog/imageviewer-dialog.component';
import { Post } from '../../shared/post.interface';

@Component({
    selector: 'app-post',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage, DescriptionComponent],
    templateUrl: './post.component.html',
    styleUrl: './post.component.scss'
})
export class PostComponent {
    private readonly _dialog = inject(MatDialog);

    post = input.required<Post>();

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
}
