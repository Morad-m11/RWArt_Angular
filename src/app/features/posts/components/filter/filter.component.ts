import { Component, computed, signal } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import {
    combineLatest,
    debounceTime,
    distinctUntilChanged,
    map,
    skip,
    startWith
} from 'rxjs';
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

    searchControl = new FormControl('', { nonNullable: true });

    selected = signal<Partial<Record<TagCategory, string>>>({});

    searchChange = this.searchControl.valueChanges.pipe(
        map((x) => x.trim().toLowerCase()),
        startWith('')
    );

    tagSelectionChange = toObservable(this.selected).pipe(
        map((tags) =>
            Object.entries(tags).map(([key, value]) => ({
                category: key as TagCategory,
                name: value
            }))
        )
    );

    filtered = outputFromObservable<FilterChangeEvent>(
        combineLatest([this.searchChange, this.tagSelectionChange]).pipe(
            skip(1),
            debounceTime(500),
            distinctUntilChanged(stringifyEquals),
            map(([search, tags]) => ({ search, tags }))
        )
    );

    hasSelected = computed(() => Object.keys(this.selected()).length);

    clearSearch() {
        this.searchControl.reset();
    }

    selectFilter(category: TagCategory, item: string) {
        this.selected.update((value) => {
            value[category] = item;
            return { ...value };
        });
    }

    clearFilter(category: TagCategory) {
        this.selected.update((value) => {
            delete value[category];
            return { ...value };
        });
    }

    clearAllFilters() {
        this.selected.set({});
    }
}

function stringifyEquals<T, R>(a: T, b: R): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}
