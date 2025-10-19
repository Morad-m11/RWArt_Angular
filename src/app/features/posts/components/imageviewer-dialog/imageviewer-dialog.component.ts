import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';
import { DescriptionComponent } from '../post/description/description.component';

export interface ImageViewerDialogData {
    post: Post;
}

@Component({
    selector: 'app-imageviewer-dialog',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage, DescriptionComponent],
    templateUrl: './imageviewer-dialog.component.html',
    styleUrl: './imageviewer-dialog.component.scss'
})
export class ImageviewerDialogComponent {
    readonly data = inject<ImageViewerDialogData>(MAT_DIALOG_DATA);
    readonly windowHeight = window.innerHeight;
    readonly windowWidth = window.innerWidth;
}
