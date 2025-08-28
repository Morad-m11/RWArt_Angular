import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { setInputs } from 'src/app/shared/test/set-inputs';
import { VerificationComponent } from './verification.component';

describe('VerificationComponent', () => {
    let component: VerificationComponent;
    let fixture: ComponentFixture<VerificationComponent>;
    let httpTesting: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VerificationComponent],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                provideZonelessChangeDetection()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(VerificationComponent);
        component = fixture.componentInstance;
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should request a verification for the token', () => {
        setInputs(fixture, { token: 'some token' });
        TestBed.tick();

        httpTesting.expectOne(Endpoints.auth.verifyAccount('some token')).flush(null);
    });

    it('should render errors', async () => {
        setInputs(fixture, { token: 'some token' });
        TestBed.tick();

        const req = httpTesting.expectOne(Endpoints.auth.verifyAccount('some token'));
        req.flush('failed', { status: 400, statusText: 'Bad Request' });
        await fixture.whenStable();

        const text = fixture.debugElement.nativeElement.textContent;
        expect(text).toContain(component.errorMessage());
    });
});
