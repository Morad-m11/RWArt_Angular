import { ComponentFixture, TestBed } from '@angular/core/testing';

import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { provideValue } from '../../provide';
import { ProfileButtonComponent } from './profile-button.component';

describe('ProfileButtonComponent', () => {
    let component: ProfileButtonComponent;
    let fixture: ComponentFixture<ProfileButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ProfileButtonComponent],
            providers: [
                provideValue(AuthService, { currentUser: signal(null) }),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
