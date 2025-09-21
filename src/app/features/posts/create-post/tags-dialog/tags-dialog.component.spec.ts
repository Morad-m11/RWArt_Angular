import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideValue } from 'src/app/shared/provide';
import { TagsDialogComponent, TagsDialogData } from './tags-dialog.component';

describe('TagsDialogComponent', () => {
    let component: TagsDialogComponent;
    let fixture: ComponentFixture<TagsDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TagsDialogComponent],
            providers: [
                provideValue<TagsDialogData>(MAT_DIALOG_DATA, { selectedTags: [] })
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TagsDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
