import { Component } from '@angular/core';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FeaturedComponent } from './components/featured/featured.component';
import { PostListComponent } from './components/post-list/post-list.component';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, FeaturedComponent, PostListComponent, IconTextComponent],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent {}
