import { NgOptimizedImage } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { FeaturedComponent } from './featured/featured.component';
import { ImageviewerDialogComponent } from './imageviewer-dialog/imageviewer-dialog.component';
import { Post } from './shared/post.interface';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, RouterLink, FeaturedComponent, NgOptimizedImage],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export default class PostsComponent {
    private readonly _dialog = inject(MatDialog);

    posts = httpResource<Post[]>(() => Endpoints.post.list);

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
