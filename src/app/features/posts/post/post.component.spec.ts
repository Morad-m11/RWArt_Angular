import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IMAGE_LOADER } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { provideValue } from 'src/app/shared/provide';
import { setInputs } from 'src/app/shared/test/set-inputs';
import { DescriptionComponent } from '../description/description/description.component';
import { PostsService } from '../services/posts.service';
import { Post } from '../shared/post.interface';
import { PostComponent } from './post.component';

const POST: Post = {
    id: '1',
    title: 'title',
    description: 'description',
    author: { username: 'me' },
    imageId: '1',
    imageUrl: 'image url',
    upvoted: false,
    upvoteCount: 1
};

describe('PostComponent', () => {
    let component: PostComponent;
    let fixture: ComponentFixture<PostComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PostComponent],
            providers: [
                provideValue(PostsService),
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
        setInputs(fixture, { post: POST, height: 100 });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({ template: 'app-description' })
class DescriptionComponentMock {
    post = input.required<Post>();
}
