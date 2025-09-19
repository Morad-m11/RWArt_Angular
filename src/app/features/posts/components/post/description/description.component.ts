import { Component, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { Post } from '../../../shared/post.interface';

@Component({
    selector: 'app-description',
    standalone: true,
    imports: [MaterialModule, RouterLink],
    templateUrl: './description.component.html',
    styleUrl: './description.component.scss'
})
export class DescriptionComponent {
    post = input.required<Post>();
    upvoted = output();

    isExpanded = signal(false);

    toggleExpand() {
        this.isExpanded.update((x) => !x);
    }
}
