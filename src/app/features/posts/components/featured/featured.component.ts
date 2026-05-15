import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { PromptComponent } from 'src/app/shared/components/prompt/prompt.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../shared/post.interface';
import { PostComponent } from '../post/post.component';

@Component({
    selector: 'app-featured',
    standalone: true,
    imports: [MaterialModule, IconTextComponent, PromptComponent, PostComponent],
    templateUrl: './featured.component.html',
    styleUrl: './featured.component.scss'
})
export class FeaturedComponent {
    promptClosed = signal(false);

    posts = httpResource<Post[]>(() => Endpoints.post.featured, {
        defaultValue: []
    });

    closePromptBox() {
        this.promptClosed.set(true);
    }
}
