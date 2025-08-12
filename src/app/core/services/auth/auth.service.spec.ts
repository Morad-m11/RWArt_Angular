import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideValue } from 'src/app/shared/provide';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../constants/access-token';
import { Endpoints } from '../../constants/api-endpoints';
import { CoreSnackbarMessages } from '../../constants/snackbar-messages';
import { SnackbarService } from '../snackbar/snackbar.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideValue(SnackbarService, { error: jest.fn() }),
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        service = TestBed.inject(AuthService);
        expect(service).toBeTruthy();
    });

    describe('Logged in state on init', () => {
        afterEach(() => {
            localStorage.clear();
        });

        it("should be false if token doesn't exist", () => {
            service = TestBed.inject(AuthService);
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should be true if token exists', () => {
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'sometoken');
            service = TestBed.inject(AuthService);
            expect(service.isLoggedIn()).toBe(true);
        });
    });

    describe('Profile request', () => {
        afterEach(() => {
            httpTesting.verify();
        });

        it('should not send a request for profile initially', () => {
            service = TestBed.inject(AuthService);
            TestBed.tick();

            httpTesting.expectNone(Endpoints.user.profile);
        });

        it('should send a request for profile when logged in', async () => {
            service = TestBed.inject(AuthService);
            service.isLoggedIn.set(true);
            TestBed.tick();

            httpTesting.expectOne(Endpoints.user.profile);
        });
    });

    describe('Auth functionality', () => {
        afterEach(() => {
            httpTesting.verify();
        });

        describe('Login', () => {
            it('should do nothing on failure', async () => {
                service = TestBed.inject(AuthService);

                const promise = service.login('user', 'pass');
                const req = httpTesting.expectOne(Endpoints.auth.login);

                req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });

                await expect(promise).rejects.toMatchObject({ status: 401 });
                expect(service.isLoggedIn()).toBe(false);
                expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
            });

            it('should set logged in state & access token on success', async () => {
                service = TestBed.inject(AuthService);

                const promise = service.login('user', 'pass');
                const req = httpTesting.expectOne(Endpoints.auth.login);

                req.flush({ accessToken: 'some token' });
                await promise;

                expect(service.isLoggedIn()).toBe(true);
                expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('some token');
            });
        });

        describe('Logout', () => {
            beforeEach(() => {
                service.isLoggedIn.set(true);
                localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'some token');
            });

            afterEach(() => {
                localStorage.clear();
                httpTesting.verify();
            });

            it('should display an error message if called with expiration flag and not make a request', async () => {
                const service = TestBed.inject(AuthService);
                const snackbar = TestBed.inject(SnackbarService);

                await service.logout({ expired: true });

                expect(snackbar.error).toHaveBeenCalledWith(CoreSnackbarMessages.expired);
            });

            it('should make a logout request if not expired, and do nothing on failure', async () => {
                const service = TestBed.inject(AuthService);
                const snackbar = TestBed.inject(SnackbarService);

                const promise = service.logout();
                const req = httpTesting.expectOne(Endpoints.auth.logout);
                req.flush(null, { status: 500, statusText: 'Server Error!' });

                await expect(promise).rejects.toMatchObject({ status: 500 });

                expect(snackbar.error).not.toHaveBeenCalled();
                expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('some token');
                expect(service.isLoggedIn()).toBe(true);
            });

            it('should make a logout request if not expired, clear access-token & set logged in state', async () => {
                const service = TestBed.inject(AuthService);
                const snackbar = TestBed.inject(SnackbarService);

                const promise = service.logout();
                const req = httpTesting.expectOne(Endpoints.auth.logout);
                req.flush(null);

                await promise;

                expect(snackbar.error).not.toHaveBeenCalled();
                expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBeNull();
                expect(service.isLoggedIn()).toBe(false);
            });
        });

        describe('Refresh Token', () => {
            it('should do nothing on request failure', async () => {
                service = TestBed.inject(AuthService);

                localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'some token');

                const promise = service.refreshToken();
                const req = httpTesting.expectOne(Endpoints.auth.refresh);
                req.flush(null, { status: 500, statusText: 'Server Error!' });

                await expect(promise).rejects.toMatchObject({ status: 500 });
                expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('some token');
            });

            it('should write access token response to localstorage on success', async () => {
                service = TestBed.inject(AuthService);

                localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'some token');

                const promise = service.refreshToken();
                const req = httpTesting.expectOne(Endpoints.auth.refresh);
                req.flush({ accessToken: 'new token' });

                await promise;

                expect(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)).toBe('new token');
            });
        });
    });
});
