import { AfterViewInit, Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {
    constructor(private _el: ElementRef<HTMLElement>) {}

    async ngAfterViewInit(): Promise<void> {
        requestAnimationFrame(() => {
            this._el.nativeElement.focus();
        });
    }
}
