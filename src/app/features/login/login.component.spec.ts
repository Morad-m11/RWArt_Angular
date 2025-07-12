import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../core/services/auth/auth.service';
import { provideValue } from '../../shared/provide';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [provideValue(AuthService)]
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
