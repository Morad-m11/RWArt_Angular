import { TestBed } from '@angular/core/testing';

import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideValue } from 'src/app/shared/provide';
import { Endpoints } from '../../constants/api-endpoints';
import { CoreSnackbarMessages } from '../../constants/snackbar-messages';
import { SnackbarService } from '../snackbar/snackbar.service';
import { StorageService } from '../storage/storage.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let httpTesting: HttpTestingController;
    let storageService: jest.Mocked<StorageService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideValue(SnackbarService, {
                    error: jest.fn()
                }),
                provideValue(StorageService, {
                    getAccessToken: jest.fn().mockReturnValue(null),
                    setAccessToken: jest.fn(),
                    clearAccessToken: jest.fn()
                }),
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        httpTesting = TestBed.inject(HttpTestingController);
        storageService = TestBed.inject(StorageService) as jest.Mocked<StorageService>;
    });

    it('should be created', () => {
        service = TestBed.inject(AuthService);
        expect(service).toBeTruthy();
    });

    describe('Logged in state on init', () => {
        it("should be false if token doesn't exist", () => {
            service = TestBed.inject(AuthService);
            expect(service.isLoggedIn()).toBe(false);
        });

        it('should be true if token exists', () => {
            storageService.getAccessToken.mockReturnValue('some token');
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
                expect(storageService.setAccessToken).not.toHaveBeenCalled();
            });

            it('should set logged in state & access token on success', async () => {
                service = TestBed.inject(AuthService);

                const promise = service.login('user', 'pass');
                const req = httpTesting.expectOne(Endpoints.auth.login);

                req.flush({ accessToken: 'some token' });
                await promise;

                expect(service.isLoggedIn()).toBe(true);
                expect(storageService.setAccessToken).toHaveBeenCalledWith('some token');
            });
        });

        describe('Logout', () => {
            beforeEach(() => {
                service = TestBed.inject(AuthService);
                service.isLoggedIn.set(true);
            });

            afterEach(() => {
                httpTesting.verify();
            });

            it('should display an error message if called with expiration flag and not make a request', async () => {
                const snackbar = TestBed.inject(SnackbarService);

                await service.logout({ expired: true });

                expect(snackbar.error).toHaveBeenCalledWith(CoreSnackbarMessages.expired);
            });

            it('should make a logout request if not marked as expired, and do nothing on failure', async () => {
                const snackbar = TestBed.inject(SnackbarService);

                const promise = service.logout();
                const req = httpTesting.expectOne(Endpoints.auth.logout);
                req.flush(null, { status: 500, statusText: 'Server Error!' });

                await expect(promise).rejects.toMatchObject({ status: 500 });

                expect(snackbar.error).not.toHaveBeenCalled();
                expect(storageService.clearAccessToken).not.toHaveBeenCalled();
                expect(service.isLoggedIn()).toBe(true);
            });

            it('should make a logout request if not expired, clear access-token & set logged in state', async () => {
                const snackbar = TestBed.inject(SnackbarService);

                const promise = service.logout();
                const req = httpTesting.expectOne(Endpoints.auth.logout);
                req.flush(null);

                await promise;

                expect(snackbar.error).not.toHaveBeenCalled();
                expect(storageService.clearAccessToken).toHaveBeenCalled();
                expect(service.isLoggedIn()).toBe(false);
            });
        });

        describe('Refresh Token', () => {
            it('should do nothing on request failure', async () => {
                service = TestBed.inject(AuthService);

                const promise = service.refreshToken();
                const req = httpTesting.expectOne(Endpoints.auth.refresh);
                req.flush(null, { status: 500, statusText: 'Server Error!' });

                await expect(promise).rejects.toMatchObject({ status: 500 });
                expect(storageService.clearAccessToken).not.toHaveBeenCalled();
            });

            it('should set access token on success', async () => {
                service = TestBed.inject(AuthService);

                const promise = service.refreshToken();
                const req = httpTesting.expectOne(Endpoints.auth.refresh);
                req.flush({ accessToken: 'new token' });

                await promise;
                expect(storageService.setAccessToken).toHaveBeenCalledWith('new token');
            });
        });
    });
});
