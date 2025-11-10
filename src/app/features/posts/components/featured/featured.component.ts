import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { PromptComponent } from 'src/app/shared/components/prompt/prompt.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';
import { CarouselComponent } from './carousel/carousel.component';

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule, IconTextComponent, CarouselComponent, PromptComponent],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    private readonly _limit = 3;

    promptClosed = signal(false);

    posts = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.featured,
            params: { limit: this._limit }
        }),
        { defaultValue: [] }
    );

    closePromptBox() {
        this.promptClosed.set(true);
    }
}
