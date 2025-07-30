import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { provideValue } from 'src/app/shared/provide';
import { AsyncUniqueValidator } from '../shared/services/unique.validator';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
    let component: SignupComponent;
    let fixture: ComponentFixture<SignupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SignupComponent],
            providers: [
                provideValue(AuthService),
                provideValue(AsyncUniqueValidator, { validate: () => of(null) }),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
