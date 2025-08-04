import { AbstractControl } from '@angular/forms';
import { assert } from 'src/app/shared/assert';
import { TypedValidatorFn } from '../validation-types';

export const passwordMatchValidator: TypedValidatorFn = (control: AbstractControl) => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');

    assert(password && passwordConfirm, 'Missing one of the password controls');

    if (password.value !== passwordConfirm.value) {
        passwordConfirm.setErrors({ passwordMatch: true });
        return { passwordMatch: true };
    } else {
        passwordConfirm.setErrors(null);
        return null;
    }
};
