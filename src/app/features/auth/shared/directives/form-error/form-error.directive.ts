import { Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { filter, map, startWith, switchMap } from 'rxjs';
import { ValidationMessages } from '../../validators/validation-errors';
import { TypedValidationErrors } from '../../validators/validation-types';

@Directive({
    selector: '[appFormError]',
    standalone: true
})
export class FormErrorDirective {
    private readonly element = inject(ElementRef<unknown>);
    private readonly renderer = inject(Renderer2);

    control = input.required<FormControl>({ alias: 'appFormError' });

    message = toSignal(
        toObservable(this.control).pipe(
            switchMap((control) =>
                control.statusChanges.pipe(
                    filter((status) => status === 'INVALID'),
                    map(() => control.errors),
                    startWith(control.errors)
                )
            ),
            map((errors) => this._computeErrorMessage(errors))
        )
    );

    constructor() {
        effect(() => {
            const message = this.message();
            this.renderer.setProperty(this.element.nativeElement, 'textContent', message);
        });
    }

    private _computeErrorMessage(errors: TypedValidationErrors | null): string {
        if (!errors) {
            return '';
        }

        const keys = Object.keys(errors) as (keyof TypedValidationErrors)[];
        if (!keys.length) {
            return '';
        }

        const firstKey = keys[0];
        const message = ValidationMessages[firstKey];

        if (typeof message === 'function') {
            // casting as never because it's not possible to know whether the arguments
            // actually match the targeted function. This is type-safe due to the narrowing beforehand
            const firstErrorArguments = errors[firstKey];
            return message(firstErrorArguments as never);
        }

        return message;
    }
}
