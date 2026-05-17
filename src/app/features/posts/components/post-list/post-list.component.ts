import { httpResource } from '@angular/common/http';
import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { RWBoxComponent } from 'src/app/shared/components/rw-box/rw-box.component';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';
import { PostComponent } from '../post/post.component';

@Component({
    selector: 'app-post-list',
    standalone: true,
    imports: [
        MaterialModule,
        LoadingDirective,
        IconTextComponent,
        PostComponent,
        RWBoxComponent
    ],
    templateUrl: './post-list.component.html',
    styleUrl: './post-list.component.scss'
})
export class PostListComponent {
    filters = input<{ search: string; tags: string[] }>({
        search: '',
        tags: []
    });

    private readonly _offset = signal(0);
    private readonly _limit = 10;

    fetchedFirstPosts = computed(() => this.postResource.status() == 'resolved');

    postResource = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.base,
            params: {
                limit: this._limit,
                offset: this._offset(),
                search: this.filters().search ?? '',
                tags: this.filters().tags
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

    loadMorePosts() {
        this._offset.update((x) => x + this._limit);
    }
}
