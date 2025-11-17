import { Component, computed, output, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { FILTERS } from 'src/app/shared/rainworld';
import { TagCategory } from '../../shared/post.interface';

export interface FilterChangeEvent {
    search: string;
    tags: string[];
}

interface Tags {
    type?: string[];
    character?: string[];
    style?: string[];
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
    tags = signal<Tags>({});

    hasSelectedTags = computed(() => Object.keys(this.tags()).length > 0);

    submit() {
        this.filtered.emit({
            search: this.search.value,
            tags: Object.values(this.tags()).flat().filter(Boolean)
        });
    }

    selectFilter(category: TagCategory, name: string) {
        this.tags.update((value) => {
            const current = (value[category] ||= []);
            const includesIndex = current.indexOf(name);

            if (includesIndex == -1) {
                current.push(name);
            } else {
                current.splice(includesIndex, 1);
            }

            return { ...value };
        });
    }

    clearSearch() {
        this.search.reset();
    }

    clearFilter(category: TagCategory) {
        this.tags.update((value) => {
            delete value[category];
            return { ...value };
        });
    }

    clearAllFilters() {
        this.tags.set({});
    }
}
