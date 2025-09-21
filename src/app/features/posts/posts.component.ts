import { httpResource } from '@angular/common/http';
import { Component, computed, effect, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from './components/post/post.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { Post } from './shared/post.interface';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [
        MaterialModule,
        RouterLink,
        PostComponent,
        LoadingDirective,
        IconTextComponent,
        SearchBarComponent
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent {
    private readonly _featuredLimit = 3;
    private readonly _postsLimit = 10;
    private readonly _offset = signal(0);

    featuredPosts = httpResource<Post[]>(() => ({
        url: Endpoints.post.featured,
        params: { limit: this._featuredLimit }
    }));

    postResource = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.base,
            params: {
                search: this.searchTerm(),
                limit: this._postsLimit,
                offset: this._offset()
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

    searchTerm = signal('');

    constructor() {
        effect(() => {
            console.warn(this.postResource.headers());
        });
    }

    refresh() {
        this.featuredPosts.reload();
        this.postResource.reload();
    }

    filterPosts(search: string) {
        this.searchTerm.set(search);
    }

    loadMorePosts() {
        this._offset.update((x) => x + this._postsLimit);
    }
}
