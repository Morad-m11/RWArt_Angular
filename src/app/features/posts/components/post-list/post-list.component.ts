import { httpResource } from '@angular/common/http';
import {
    Component,
    computed,
    input,
    linkedSignal,
    numberAttribute,
    signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostMenuComponent } from '../../post/post-menu/post-menu.component';
import { Post, Tag } from '../../shared/post.interface';
import { FilterChangeEvent, FilterComponent } from '../filter/filter.component';
import { PostComponent } from '../post/post.component';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [
        MaterialModule,
        LoadingDirective,
        IconTextComponent,
        FilterComponent,
        RouterLink,
        PostMenuComponent,
        PostComponent
    ],
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss'
})
export class PostListComponent {
    private readonly _offset = signal(0);

    limit = input(10, { transform: numberAttribute });

    filters = signal<{ search?: string; tags?: Tag[] }>({});

    postResource = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.base,
            params: {
                limit: this.limit(),
                offset: this._offset(),
                search: this.filters().search ?? '',
                tags: JSON.stringify(this.filters().tags ?? [])
            }
        }),
        { defaultValue: [] }
    );

    totalPostCount = computed(
        () => +(this.postResource.headers()?.get('X-Total-Count') ?? 0)
    );

    posts = linkedSignal<Post[], Post[]>({
        source: () => this.postResource.value(),
        computation: (source, prev) => {
            if (!prev) {
                return source;
            }

            if (this._offset() === 0) {
                return source;
            }

            return [...prev.value, ...source];
        }
    });

    refresh() {
        this.postResource.reload();
    }

    filterPosts(filters: FilterChangeEvent) {
        this.filters.set(filters);
    }

    loadMorePosts() {
        this._offset.update((x) => x + this.limit());
    }
}
