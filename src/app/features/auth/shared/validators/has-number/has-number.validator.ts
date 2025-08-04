import { AbstractControl } from '@angular/forms';
import { assert } from 'src/app/shared/assert';
import { TypedValidatorFn } from '../validation-types';

export const hasNumberValidator: TypedValidatorFn = (
    control: AbstractControl<string>
) => {
    assert(typeof control.value === 'string', 'Controls value is not a string');

    const hasNumber = /\d+/.test(control.value);
    return hasNumber ? null : { hasNumber: true };
};
