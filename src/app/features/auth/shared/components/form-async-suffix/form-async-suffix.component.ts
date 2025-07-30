import { Component, input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-form-async-suffix',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './form-async-suffix.component.html',
    styleUrl: './form-async-suffix.component.scss'
})
export class FormAsyncSuffixComponent {
    control = input.required<FormControl>();
}
