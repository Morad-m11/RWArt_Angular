import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideValue } from 'src/app/shared/provide';
import { Post } from '../../shared/post.interface';
import { DescriptionComponent } from '../post/description/description.component';
import {
    ImageviewerDialogComponent,
    ImageViewerDialogData
} from './imageviewer-dialog.component';

const POST: Post = {
    id: '1',
    author: { username: 'me' },
    title: 'title',
    description: 'desc',
    imageId: '1',
    tags: [],
    upvoteCount: 1,
    isUpvoted: true,
    isOwner: false
};

describe('ImageviewerDialogComponent', () => {
    let component: ImageviewerDialogComponent;
    let fixture: ComponentFixture<ImageviewerDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImageviewerDialogComponent],
            providers: [
                provideValue<ImageViewerDialogData>(MAT_DIALOG_DATA, {
                    post: POST
                })
            ]
        })
            .overrideComponent(ImageviewerDialogComponent, {
                remove: { imports: [DescriptionComponent] },
                add: { imports: [DescriptionComponentMock] }
            })
            .compileComponents();

        fixture = TestBed.createComponent(ImageviewerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Component({ selector: 'app-description', template: '' })
export class DescriptionComponentMock {
    post = input();
}
