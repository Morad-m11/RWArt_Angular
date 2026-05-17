import {
    Combobox,
    ComboboxInput,
    ComboboxPopup,
    ComboboxPopupContainer
} from '@angular/aria/combobox';
import { Listbox, Option } from '@angular/aria/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, input, viewChild } from '@angular/core';
import { MaterialModule } from '../../material.module';

@Component({
    selector: 'app-select',
    imports: [
        Combobox,
        ComboboxInput,
        ComboboxPopup,
        ComboboxPopupContainer,
        Listbox,
        Option,
        OverlayModule,
        MaterialModule
    ],
    templateUrl: './select.component.html',
    styleUrl: './select.component.scss'
})
export class SelectComponent {
    name = input.required<string>();
    options = input.required<{ name: string; icon: string }[]>();

    /** The combobox listbox popup. */
    listbox = viewChild<Listbox<string>>(Listbox);

    /** The icon that is displayed in the combobox. */
    displayIcon = computed(() => {
        const values = this.listbox()?.values() || [];
        const label = this.options().find((x) => x.name === values[0]);
        return label ? label.icon : '';
    });

    /** The string that is displayed in the combobox. */
    displayValue = computed(() => {
        const values = this.listbox()?.values() || [];
        return values.length ? values[0] : this.name();
    });
}
