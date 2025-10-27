import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import EmblaCarousel, { EmblaOptionsType } from 'embla-carousel';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../../shared/post.interface';
import { PostComponent } from '../../post/post.component';
import { addPrevNextBtnsClickHandlers } from './library-behaviours/EmblaCarouselArrowButtons';
import { setupTweenOpacity } from './library-behaviours/EmblaCarouselTweenOpacity';
import { setupTweenScale } from './library-behaviours/EmblaCarouselTweenScale';

const OPTIONS: EmblaOptionsType = { loop: true };

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [PostComponent, MaterialModule, RouterLink],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
    posts = input.required<Post[]>();

    ngOnInit(): void {
        const emblaNode = <HTMLElement>document.querySelector('.embla');
        const viewportNode = <HTMLElement>emblaNode.querySelector('.embla__viewport');
        const prevBtn = <HTMLElement>emblaNode.querySelector('.embla__button--prev');
        const nextBtn = <HTMLElement>emblaNode.querySelector('.embla__button--next');

        const emblaApi = EmblaCarousel(viewportNode, OPTIONS);
        const removeTweenScale = setupTweenScale(emblaApi);
        const removeTweenOpacity = setupTweenOpacity(emblaApi);

        const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
            emblaApi,
            prevBtn,
            nextBtn
        );

        emblaApi
            .on('destroy', removeTweenOpacity)
            .on('destroy', removeTweenScale)
            .on('destroy', removePrevNextBtnsClickHandlers);
    }
}
