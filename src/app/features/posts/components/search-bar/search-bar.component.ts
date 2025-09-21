import { Component, signal } from '@angular/core';
import { outputFromObservable } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';

interface Filter {
    name: string;
    icon: string;
    items: string[];
}

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
    readonly filters: Filter[] = [
        {
            name: 'Type',
            icon: 'type_specimen',
            items: ['Artwork', 'Meme', 'Animation']
        },
        {
            name: 'Character',
            icon: 'flutter_dash',
            items: ['Slugcat', 'Creature', 'Iterator']
        },
        {
            name: 'Style',
            icon: 'style',
            items: ['Digital', 'Sketch', '3D']
        }
    ];

    readonly searchControl = new FormControl('', { nonNullable: true });

    selected = signal<Record<string, string>>({});

    searched = outputFromObservable(
        this.searchControl.valueChanges.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            map((x) => x.trim().toLowerCase())
        )
    );

    selectFilter(parent: string, item: string) {
        this.selected.update((value) => {
            value[parent] = item;
            return { ...value };
        });
    }
}
