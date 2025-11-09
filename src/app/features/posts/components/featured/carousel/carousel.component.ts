import { Component, input, OnInit } from '@angular/core';
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
export class CarouselComponent implements OnInit {
    posts = input.required<Post[]>();

    ngOnInit(): void {
        const emblaNode = document.querySelector('.embla') as HTMLElement;
        const viewportNode = emblaNode.querySelector('.embla__viewport') as HTMLElement;
        const prevBtn = emblaNode.querySelector('.embla__button--prev') as HTMLElement;
        const nextBtn = emblaNode.querySelector('.embla__button--next') as HTMLElement;

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
