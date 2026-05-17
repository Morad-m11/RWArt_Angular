import { OverlayModule } from '@angular/cdk/overlay';
import { Component, signal, viewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { SelectComponent } from 'src/app/shared/components/select/select.component';
import { TypingDirective } from 'src/app/shared/directives/typing/typing.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { FILTERS } from 'src/app/shared/rainworld';
import { PostListComponent } from '../post-list/post-list.component';

@Component({
    selector: 'app-search',
    imports: [
        OverlayModule,
        MaterialModule,
        IconTextComponent,
        SelectComponent,
        TypingDirective,
        PostListComponent,
        FormsModule
    ],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {
    selects = viewChildren(SelectComponent);

    options = FILTERS;

    filters = signal<{ search: string; tags: string[] }>({
        search: '',
        tags: []
    });

    submitted = signal(false);
    items = signal<number[]>([]);

    submit(value: string) {
        this.submitted.set(true);

        this.filters.update((val) => {
            val.search = value;
            val.tags = this.selects()
                .filter((x) => x.displayValue() !== x.name())
                .map((x) => x.displayValue());
            return { ...val };
        });
    }
}
