import { coerceNumberProperty } from '@angular/cdk/coercion';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';
import { PostComponent } from '../post/post.component';

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule, IconTextComponent, PostComponent, CommonModule],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    private readonly _breakpointObserver = inject(BreakpointObserver);

    limit = input(3, { transform: numberAttribute });
    postWidth = input.required({ transform: coerceNumberProperty });
    postHeight = input.required({ transform: coerceNumberProperty });

    postIndex = signal(0);

    isHandset = toSignal(
        this._breakpointObserver
            .observe('(max-width: 1400px)')
            .pipe(map((result) => result.matches))
    );

    posts = httpResource<Post[]>(
        () => ({
            url: Endpoints.post.featured,
            params: { limit: this.limit() }
        }),
        { defaultValue: [] }
    );

    refresh() {
        this.posts.reload();
    }

    next() {
        this.postIndex.update((x) => Math.min(this.posts.value().length - 1, x + 1));
    }

    prev() {
        this.postIndex.update((x) => Math.max(0, x - 1));
    }
}
