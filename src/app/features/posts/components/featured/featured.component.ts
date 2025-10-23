import { httpResource } from '@angular/common/http';
import { Component, input, numberAttribute } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule, IconTextComponent, CarouselComponent],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    limit = input(3, { transform: numberAttribute });

    posts = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.featured,
            params: { limit: this.limit() }
        }),
        { defaultValue: [] }
    );
}
