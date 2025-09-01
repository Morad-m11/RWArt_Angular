import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';
import { provideValue } from 'src/app/shared/provide';
import { UserService } from 'src/app/shared/services/user/user.service';
import { UsernamePickerComponent } from './username-picker.component';

describe('UsernamePickerComponent', () => {
    let component: UsernamePickerComponent;
    let fixture: ComponentFixture<UsernamePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UsernamePickerComponent],
            providers: [provideValue(UserService, {}), provideValue(MatDialogRef, {})]
        }).compileComponents();

        fixture = TestBed.createComponent(UsernamePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
