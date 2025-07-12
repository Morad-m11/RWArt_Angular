import { Provider } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS } from '@angular/material/progress-spinner';
import { provideValue } from 'src/app/shared/provide';

export function provideMaterialDefaults(): Provider[] {
    return [
        provideValue(MAT_FORM_FIELD_DEFAULT_OPTIONS, { appearance: 'outline' }),
        provideValue(MAT_PROGRESS_SPINNER_DEFAULT_OPTIONS, { diameter: 24 })
    ];
}
