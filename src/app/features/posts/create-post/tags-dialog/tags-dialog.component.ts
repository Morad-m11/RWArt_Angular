import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';
import { FILTERS } from 'src/app/shared/rainworld';
import { TagCategory } from '../../shared/post.interface';

export interface TagsDialogData {
    selectedTags: string[];
}

@Component({
    selector: 'app-tags-dialog',
    standalone: true,
    imports: [MaterialModule, TitleCasePipe],
    templateUrl: './tags-dialog.component.html',
    styleUrl: './tags-dialog.component.scss'
})
export class TagsDialogComponent {
    private readonly _fb = inject(FormBuilder);
    readonly data = inject<TagsDialogData>(MAT_DIALOG_DATA);

    readonly tags = FILTERS;

    form = this._fb.nonNullable.group({
        type: [this.getSelectedItemsForCategory('type')],
        character: [this.getSelectedItemsForCategory('character')],
        style: [this.getSelectedItemsForCategory('style')]
    });

    tagList = toSignal(this.form.valueChanges.pipe(map(this.formToArray)));

    formToArray(value: typeof this.form.value): string[] {
        return Object.values(value).flat() as string[];
    }

    private getSelectedItemsForCategory(category: TagCategory): string[] {
        return (
            FILTERS.find((x) => x.category === category)
                ?.items.filter((x) => this.data.selectedTags.includes(x.name))
                .map((x) => x.name)
                .flat() ?? []
        );
    }
}
