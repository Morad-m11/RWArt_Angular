import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMAGE_LOADER } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { provideValue } from 'src/app/shared/provide';
import { setInputs } from 'src/app/shared/test/set-inputs';
import { PostsService } from '../../services/posts.service';
import { Post } from '../../shared/post.interface';
import { DescriptionComponent } from './description/description.component';
import { PostComponent } from './post.component';

const POST: Post = {
    id: '1',
    title: 'title',
    description: 'description',
    author: { username: 'me' },
    imageId: '1',
    tags: [],
    upvoteCount: 1,
    isUpvoted: false,
    isOwner: false
};

describe('PostComponent', () => {
    let component: PostComponent;
    let fixture: ComponentFixture<PostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PostComponent],
            providers: [
                provideValue(PostsService, { upvoted$: new Subject() }),
                provideValue(SnackbarService),
                provideValue(MatDialog),
                provideValue(IMAGE_LOADER, () => null)
            ]
        })
            .overrideComponent(PostComponent, {
                remove: { imports: [DescriptionComponent] },
                add: { imports: [DescriptionComponentMock] }
            })
            .compileComponents();

        fixture = TestBed.createComponent(PostComponent);
        component = fixture.componentInstance;
        setInputs(fixture, { post: { ...POST }, height: '100' });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({ template: 'app-description', schemas: [CUSTOM_ELEMENTS_SCHEMA] })
class DescriptionComponentMock {}
