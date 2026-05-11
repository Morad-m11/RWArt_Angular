import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Component } from '@angular/core';
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
        PostListComponent
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent {}
