import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideRouter } from '@angular/router';
import { LoginPromptDialogComponent } from './login-prompt-dialog.component';

describe('LoginPromptDialogComponent', () => {
    let fixture: ComponentFixture<LoginPromptDialogComponent>;
    let component: LoginPromptDialogComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginPromptDialogComponent],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginPromptDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
