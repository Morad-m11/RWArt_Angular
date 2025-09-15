import { httpResource } from '@angular/common/http';
import { Component, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { LoadingDirective } from 'src/app/shared/directives/loading/loading.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from './post/post.component';
import { Post } from './shared/post.interface';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [MaterialModule, RouterLink, PostComponent, LoadingDirective],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export default class PostsComponent {
    private readonly _featuredLimit = 3;
    private readonly _postsLimit = 10;

    private _offset = signal(0);

    featuredPosts = httpResource<Post[]>(() => ({
        url: Endpoints.post.featured,
        params: { limit: this._featuredLimit }
    }));

    postResource = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.base,
            params: {
                limit: this._postsLimit,
                offset: this._offset()
            }
        }),
        { defaultValue: [] }
    );

    posts = linkedSignal<Post[], Post[]>({
        source: () => this.postResource.value(),
        computation: (source, prev) => [...(prev?.value ?? []), ...source]
    });

    refresh() {
        this.featuredPosts.reload();
        this.postResource.reload();
    }

    loadMorePosts() {
        this._offset.update((x) => x + this._postsLimit);
    }
}
