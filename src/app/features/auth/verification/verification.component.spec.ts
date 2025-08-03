import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Endpoints } from 'src/app/core/api-endpoints';
import { setInputs } from 'src/app/shared/testing/set-inputs';
import { VerificationMessages } from './messages';
import { VerificationComponent } from './verification.component';

describe('VerificationComponent', () => {
    let component: VerificationComponent;
    let fixture: ComponentFixture<VerificationComponent>;
    let httpTesting: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VerificationComponent],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(VerificationComponent);
        component = fixture.componentInstance;
        httpTesting = TestBed.inject(HttpTestingController);

        await fixture.whenStable();
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('No Token', () => {
        it('should display a verification prompt', () => {
            const title = fixture.nativeElement.querySelector('h3').textContent;
            const text = fixture.nativeElement.querySelector('p').textContent;

            expect(title).toEqual('Signup complete');
            expect(text).toEqual(
                'Please check your email to complete the verification process'
            );
        });

        it('should not make a request', () => {
            httpTesting.expectNone(Endpoints.auth.verifyAccount);
        });
    });

    describe('Token', () => {
        it('should request a verification for the token', async () => {
            setInputs(fixture, { token: 'some token' });

            await fixture.whenStable();

            httpTesting.expectOne(Endpoints.auth.verifyAccount);
        });

        it('should display an "invalid" error on 400', async () => {
            setInputs(fixture, { token: 'some token' });
            await fixture.whenStable();

            const req = httpTesting.expectOne(Endpoints.auth.verifyAccount);
            req.flush('failed', { status: 400, statusText: 'Bad Request' });
            await fixture.whenStable();

            const text = fixture.nativeElement.querySelector('p').textContent;
            expect(text).toEqual(VerificationMessages.invalid);
        });

        it('should display an "expired" error on 401', async () => {
            setInputs(fixture, { token: 'some token' });
            await fixture.whenStable();

            const req = httpTesting.expectOne(Endpoints.auth.verifyAccount);
            req.flush('failed', { status: 401, statusText: 'Unauthorized' });
            await fixture.whenStable();

            const text = fixture.nativeElement.querySelector('p').textContent;
            expect(text).toEqual(VerificationMessages.expired);
        });

        it('should display a "request failed" error with a status for everything else', async () => {
            setInputs(fixture, { token: 'some token' });
            await fixture.whenStable();

            const req = httpTesting.expectOne(Endpoints.auth.verifyAccount);
            req.flush('failed', { status: 500, statusText: 'Unknown Error' });
            await fixture.whenStable();

            const text = fixture.nativeElement.querySelector('p').textContent;
            expect(text).toEqual(`${VerificationMessages.failed} (500)`);
        });
    });
});
