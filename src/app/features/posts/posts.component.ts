import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { FeaturedComponent } from './featured/featured.component';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, RouterLink, FeaturedComponent],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export default class PostsComponent {}
