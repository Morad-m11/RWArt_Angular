import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideValue } from 'src/app/shared/provide';
import {
    ImageviewerDialogComponent,
    ImageViewerDialogData
} from './imageviewer-dialog.component';

describe('ImageviewerDialogComponent', () => {
    let component: ImageviewerDialogComponent;
    let fixture: ComponentFixture<ImageviewerDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ImageviewerDialogComponent],
            providers: [
                provideValue<ImageViewerDialogData>(MAT_DIALOG_DATA, {
                    post: {
                        id: '1',
                        author: { username: 'me' },
                        title: 'title',
                        description: 'desc',
                        imageId: '1',
                        imageUrl: 'url',
                        upvoted: true,
                        upvoteCount: 1
                    }
                })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ImageviewerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
