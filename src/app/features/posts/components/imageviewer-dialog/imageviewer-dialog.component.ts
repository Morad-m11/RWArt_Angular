import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';

export interface ImageViewerDialogData {
    post: Post;
}

@Component({
    selector: 'app-imageviewer-dialog',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage, RouterLink],
    templateUrl: './imageviewer-dialog.component.html',
    styleUrl: './imageviewer-dialog.component.scss'
})
export class ImageviewerDialogComponent {
    readonly data = inject<ImageViewerDialogData>(MAT_DIALOG_DATA);
}
