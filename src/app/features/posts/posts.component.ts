import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';
import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { FeaturedComponent } from './components/featured/featured.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { SearchComponent } from './components/search/search.component';

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
        MaterialModule,
        SearchComponent
    ],
    templateUrl: './posts.component.html',
    styleUrl: './posts.component.scss'
})
export class PostsComponent {}
