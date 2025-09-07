import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/shared/material.module';

export interface ImageViewerDialogData {
    imageId: string;
}

@Component({
    selector: 'app-imageviewer-dialog',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage],
    templateUrl: './imageviewer-dialog.component.html',
    styleUrl: './imageviewer-dialog.component.scss'
})
export class ImageviewerDialogComponent {
    readonly data = inject<ImageViewerDialogData>(MAT_DIALOG_DATA);
}
