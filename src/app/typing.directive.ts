import { booleanAttribute, Directive, ElementRef, input, Renderer2 } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { concatMap, from, map, scan, timer } from 'rxjs';

const sentenceEndSignals = ['.', '!', '?'];

@Directive({
    selector: '[appTyping]'
})
export class TypingDirective {
    letterInterval = input(30);
    breakInterval = input(300);
    breakAfterSentences = input(true, { transform: booleanAttribute });

    constructor(
        private _el: ElementRef,
        private _renderer: Renderer2
    ) {
        const placeholder: string = _el.nativeElement.placeholder;
        const chars = placeholder.split('');

        this._renderer.setAttribute(this._el.nativeElement, 'placeholder', '');

        from(chars)
            .pipe(
                concatMap((char, i) =>
                    timer(
                        i > 0 && sentenceEndSignals.includes(chars[i - 1])
                            ? this.breakInterval()
                            : this.letterInterval()
                    ).pipe(map(() => char))
                ),
                scan((text, char) => text + char),
                takeUntilDestroyed()
            )
            .subscribe((text) => {
                this._renderer.setAttribute(this._el.nativeElement, 'placeholder', text);
            });
    }
}
