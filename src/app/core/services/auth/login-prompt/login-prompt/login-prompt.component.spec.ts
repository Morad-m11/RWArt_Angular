import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { LoginPromptComponent } from './login-prompt.component';

describe('LoginPromptComponent', () => {
    let fixture: ComponentFixture<LoginPromptComponent>;
    let component: LoginPromptComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginPromptComponent],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPromptComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
