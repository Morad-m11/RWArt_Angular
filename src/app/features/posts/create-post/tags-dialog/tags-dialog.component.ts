import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';
import { FILTERS } from 'src/app/shared/rainworld';
import { Tag, TagCategory } from '../../shared/post.interface';

export interface TagsDialogData {
    selectedTags: Tag[];
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

    form = this._fb.group({
        type: this.data.selectedTags.find((x) => x.category === 'type')?.name,
        character: this.data.selectedTags.find((x) => x.category === 'character')?.name,
        style: this.data.selectedTags.find((x) => x.category === 'style')?.name
    });

    tagList = toSignal(this.form.valueChanges.pipe(map(this.formToArray)));

    formToArray(
        value: typeof this.form.value
    ): { category: TagCategory; name: string | null }[] {
        return Object.entries(value).map(([key, value]) => ({
            category: key as TagCategory,
            name: value
        }));
    }
}
