import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import EmblaCarousel, { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../../shared/post.interface';
import { PostComponent } from '../../post/post.component';
import { addPrevNextBtnsClickHandlers } from './library-behaviours/EmblaCarouselArrowButtons';
import { addDotBtnsAndClickHandlers } from './library-behaviours/EmblaCarouselDotButton';
import { setupTweenScale } from './library-behaviours/EmblaCarouselTweenScale';

@Component({
    selector: 'app-carousel',
    standalone: true,
    imports: [PostComponent, MaterialModule, RouterLink],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
    posts = input.required<Post[]>();

    ngAfterViewInit(): void {
        const OPTIONS: EmblaOptionsType = { loop: true };

        const emblaNode = <HTMLElement>document.querySelector('.embla');
        const viewportNode = <HTMLElement>emblaNode.querySelector('.embla__viewport');
        const slideNodes = Array.from(emblaNode.querySelectorAll('.embla__slide'));
        const prevBtn = <HTMLElement>emblaNode.querySelector('.embla__button--prev');
        const nextBtn = <HTMLElement>emblaNode.querySelector('.embla__button--next');
        const dotsNode = <HTMLElement>document.querySelector('.embla__dots');

        const emblaApi = EmblaCarousel(viewportNode, OPTIONS);
        const removeTweenScale = setupTweenScale(emblaApi);

        const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
            emblaApi,
            prevBtn,
            nextBtn
        );

        const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
            emblaApi,
            dotsNode
        );

        emblaApi
            .on('destroy', removeTweenScale)
            .on('destroy', removePrevNextBtnsClickHandlers)
            .on('destroy', removeDotBtnsAndClickHandlers)
            .on('init', this.highlightSelected(emblaApi, [slideNodes[0]]))
            .on('select', this.highlightSelected(emblaApi, slideNodes));
    }

    private highlightSelected(api: EmblaCarouselType, nodes: Element[]) {
        return () => {
            const previous = api.previousScrollSnap();
            const selected = api.selectedScrollSnap();
            nodes[previous].classList.remove('selected');
            nodes[selected].classList.add('selected');
        };
    }
}
