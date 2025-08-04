import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthService } from 'src/app/core/services/auth/auth.service';
import { provideValue } from 'src/app/shared/provide';
import { ResetPasswordComponent } from './reset-password.component';

describe('ResetPasswordComponent', () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResetPasswordComponent],
            providers: [provideValue(AuthService)]
        }).compileComponents();

        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
