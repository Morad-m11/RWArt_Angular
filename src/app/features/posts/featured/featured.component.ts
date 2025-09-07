import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { ImageviewerDialogComponent } from '../imageviewer-dialog/imageviewer-dialog.component';

interface Post {
    id: string;
    author: {
        username: string;
    };
    title: string;
    description: string;
    imageId: string;
    imageUrl: string;
}

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule, NgOptimizedImage],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    private readonly _dialog = inject(MatDialog);
    private readonly _featuredCount = 3;

    featuredPosts = httpResource<Post[]>(() => ({
        url: Endpoints.post.featured,
        params: { count: this._featuredCount }
    }));

    openFullscreenImage(id: string) {
        this._dialog.open(ImageviewerDialogComponent, {
            data: { imageId: id },
            width: '90vw',
            height: '90vh',
            maxWidth: '90vw',
            maxHeight: '90vh',
            autoFocus: false
        });
    }
}
