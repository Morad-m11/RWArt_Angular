import { Component, computed, output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { FILTERS } from 'src/app/shared/rainworld';
import { Tag, TagCategory } from '../../shared/post.interface';

export interface FilterChangeEvent {
    search: string;
    tags: Tag[];
}

@Component({
    selector: 'app-filter',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './filter.component.html',
    styleUrl: './filter.component.scss'
})
export class FilterComponent {
    readonly filters = FILTERS;

    filtered = output<FilterChangeEvent>();

    search = new FormControl('', { nonNullable: true });
    tags = signal<Tag[]>([]);

    selectedTagsMap = computed(() =>
        Object.fromEntries(this.tags().map((s) => [s.category, s.name]))
    );

    submit() {
        this.filtered.emit({
            search: this.search.value,
            tags: this.tags()
        });
    }

    selectFilter(category: TagCategory, name: string) {
        this.tags.update((value) => {
            const existingIndex = value.findIndex((x) => x.category === category);

            if (existingIndex !== -1) {
                value.splice(existingIndex, 1, { category, name });
                return [...value];
            }

            return [...value, { category, name }];
        });
    }

    clearSearch() {
        this.search.reset();
    }

    clearFilter(category: TagCategory) {
        this.tags.update((value) => {
            const existingIndex = value.findIndex((x) => x.category === category);

            if (existingIndex !== -1) {
                value.splice(existingIndex, 1);
            }

            return [...value];
        });
    }

    clearAllFilters() {
        this.tags.set([]);
    }
}
