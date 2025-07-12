import {
    ComponentRef,
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    inputBinding,
    Renderer2,
    ViewContainerRef
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Directive({
    selector: '[appLoading]'
})
export class LoadingDirective {
    private readonly _viewContainerRef = inject(ViewContainerRef);
    private readonly _element = inject(ElementRef);
    private readonly _renderer = inject(Renderer2);

    appLoading = input.required();

    spinner?: ComponentRef<MatProgressSpinner>;

    constructor() {
        const element: HTMLElement = this._element.nativeElement;
        let originalChildren: ChildNode[];

        effect(() => {
            const loading = this.appLoading();

            if (loading) {
                originalChildren = Array.from(element.childNodes);
                this._clearChildren(element);
                this._renderSpinner(element);
            } else {
                this._restoreChildren(element, originalChildren);
            }
        });
    }

    private _renderSpinner(element: HTMLElement): void {
        this.spinner = this._viewContainerRef.createComponent(MatProgressSpinner, {
            bindings: [
                inputBinding('diameter', () => 24),
                inputBinding('mode', () => 'indeterminate')
            ]
        });

        this._renderer.appendChild(
            element,
            this.spinner.instance._elementRef.nativeElement
        );
    }

    private _clearChildren(element: HTMLElement) {
        const children = Array.from(element.childNodes);

        children.forEach((node) => {
            this._renderer.removeChild(element, node);
        });
    }

    private _restoreChildren(element: HTMLElement, children?: ChildNode[]): void {
        this.spinner?.destroy();

        if (!children) {
            return;
        }

        this._clearChildren(element);

        children?.forEach((node) => {
            this._renderer.appendChild(element, node);
        });
    }
}
