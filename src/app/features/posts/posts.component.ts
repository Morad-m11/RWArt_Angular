import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Component } from '@angular/core';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { AutofocusDirective } from 'src/app/shared/directives/autofocus/autofocus.directive';
import { MaterialModule } from 'src/app/shared/material.module';
import { TypingDirective } from 'src/app/typing.directive';
import { FeaturedComponent } from './components/featured/featured.component';
import { PostListComponent } from './components/post-list/post-list.component';

@Component({
    selector: 'app-posts',
    standalone: true,
    imports: [
        Tab,
        Tabs,
        TabList,
        TabPanel,
        TabContent,
        FeaturedComponent,
        PostListComponent,
        TypingDirective,
        IconTextComponent,
        MaterialModule,
        AutofocusDirective
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent {
    search(value: string) {
        console.log(value);
    }
}
