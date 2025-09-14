import { TestBed } from '@angular/core/testing';

import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
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
                    hasAccessToken: jest.fn().mockReturnValue(false),
                    setAccessToken: jest.fn(),
                    clearAccessToken: jest.fn()
                }),
                provideValue(MatDialog, {
                    open: jest.fn().mockReturnValue({
                        afterClosed: jest.fn().mockReturnValue(of(null))
                    })
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
            storageService.hasAccessToken.mockReturnValue(true);
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

            httpTesting.expectNone(Endpoints.auth.me);
        });

        it('should send a request for profile when logged in', async () => {
            service = TestBed.inject(AuthService);
            service.isLoggedIn.set(true);
            TestBed.tick();

            httpTesting.expectOne(Endpoints.auth.me);
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
                const req = httpTesting.expectOne(Endpoints.auth.login.local);

                req.flush('Login failed', { status: 401, statusText: 'Unauthorized' });

                await expect(promise).rejects.toMatchObject({ status: 401 });
                expect(service.isLoggedIn()).toBe(false);
                expect(storageService.setAccessToken).not.toHaveBeenCalled();
            });

            it('should set logged in state & access token on success', async () => {
                service = TestBed.inject(AuthService);

                const promise = service.login('user', 'pass');
                const req = httpTesting.expectOne(Endpoints.auth.login.local);

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

        describe('Refreshing ', () => {
            beforeEach(() => {
                service = TestBed.inject(AuthService);
            });

            it('should only refresh once on simultaneous calls', async () => {
                service.refreshAuth();
                service.refreshAuth();
                service.refreshAuth();

                await Promise.resolve();

                httpTesting
                    .expectOne(Endpoints.auth.refresh)
                    .flush({ accessToken: 'new token' });
            });

            it('should log out and clear access token on failure', async () => {
                const promise = service.refreshAuth();

                httpTesting
                    .expectOne(Endpoints.auth.refresh)
                    .flush(null, { status: 500, statusText: 'Server Error!' });

                await expect(promise).rejects.toMatchObject({ status: 500 });
                expect(storageService.clearAccessToken).toHaveBeenCalled();
                expect(service.isLoggedIn()).toBe(false);
            });

            it('should set access token on success', async () => {
                const promise = service.refreshAuth();

                httpTesting
                    .expectOne(Endpoints.auth.refresh)
                    .flush({ accessToken: 'new token' });

                await promise;
                expect(storageService.setAccessToken).toHaveBeenCalledWith('new token');
            });
        });

        describe('Auth Error Handling', () => {
            beforeEach(() => {
                service = TestBed.inject(AuthService);
                jest.spyOn(service, 'refreshAuth');
            });

            afterEach(() => {
                expect(service.refreshAuth).not.toHaveBeenCalled();
            });

            it('should do nothing on non-401 errors', async () => {
                const promise403 = service.handleAuthError(
                    new HttpErrorResponse({ status: 403 })
                );

                await expect(promise403).rejects.toMatchObject({ status: 403 });

                const promise500 = service.handleAuthError(
                    new HttpErrorResponse({ status: 500 })
                );

                await expect(promise500).rejects.toMatchObject({ status: 500 });
            });

            it('should rethrow if not logged in', async () => {
                service.isLoggedIn.set(false);

                const promise = service.handleAuthError(
                    new HttpErrorResponse({ status: 401 })
                );

                await expect(promise).rejects.toMatchObject({ status: 401 });
            });

            it('should do nothing on 401 errors to auth routes', async () => {
                jest.spyOn(service, 'refreshAuth').mockResolvedValue(null);

                const promiseLogin = service.handleAuthError(
                    new HttpErrorResponse({
                        url: Endpoints.auth.login.local,
                        status: 401
                    })
                );
                await expect(promiseLogin).rejects.toMatchObject({ status: 401 });
            });

            it('should rethrow & prompt login on non auth route 401 errors', async () => {
                jest.spyOn(service, 'promptLogin');

                const promiseLogin = service.handleAuthError(
                    new HttpErrorResponse({
                        url: Endpoints.post.upvote('1'),
                        status: 401
                    })
                );

                await expect(promiseLogin).rejects.toMatchObject({ status: 401 });
                expect(service.promptLogin).toHaveBeenCalled();
            });
        });
    });
});
