import {
    HttpClient,
    HttpInterceptorFn,
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { provideValue } from 'src/app/shared/provide';
import { Endpoints } from '../../constants/api-endpoints';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
    let httpClient: HttpClient;
    let httpTesting: HttpTestingController;
    let authService: jest.Mocked<AuthService>;
    let storageService: jest.Mocked<StorageService>;

    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => authInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideValue(AuthService, {
                    refreshToken: jest.fn().mockResolvedValue(undefined),
                    logout: jest.fn()
                }),
                provideValue(StorageService, {
                    getAccessToken: jest.fn().mockReturnValue('test_access_token')
                }),
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting()
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService) as jest.Mocked<AuthService>;
        storageService = TestBed.inject(StorageService) as jest.Mocked<StorageService>;
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    describe('Auth Flow', () => {
        describe('withCredentials', () => {
            it('should set credentials on login & refresh URLs', async () => {
                firstValueFrom(httpClient.get('test'));
                firstValueFrom(httpClient.get(Endpoints.auth.login.local));
                firstValueFrom(httpClient.get(Endpoints.auth.refresh));

                httpTesting
                    .expectOne((req) => req.url === 'test' && !req.withCredentials)
                    .flush(null);

                httpTesting
                    .expectOne(
                        (req) =>
                            req.url === Endpoints.auth.login.local && req.withCredentials
                    )
                    .flush(null);

                httpTesting
                    .expectOne(
                        (req) => req.url === Endpoints.auth.refresh && req.withCredentials
                    )
                    .flush(null);
            });
        });

        describe('Authorization header', () => {
            it('should append without modifying original headers', async () => {
                const promise = firstValueFrom(
                    httpClient.get('test', {
                        headers: { custom: 'foo' },
                        withCredentials: true
                    })
                );

                const req = httpTesting.expectOne((req) => {
                    return (
                        req.url === 'test' &&
                        req.headers.get('custom') === 'foo' &&
                        req.headers.get('Authorization') === 'Bearer test_access_token'
                    );
                });

                req.flush(null);

                await expect(promise).resolves.toBeNull();
            });

            it('should not attach header if access token is not present', async () => {
                storageService.getAccessToken.mockReturnValue(null);

                const promise = firstValueFrom(
                    httpClient.get('test', { headers: { custom: 'foo' } })
                );

                const req = httpTesting.expectOne(
                    (req) => !req.headers.has('Authorization')
                );

                req.flush(null);

                await expect(promise).resolves.toBeNull();
            });
        });
    });

    describe('Error propagation', () => {
        afterEach(() => {
            expect(authService.refreshToken).not.toHaveBeenCalled();
        });

        it('should propagate if no access token is stored', async () => {
            const promise = firstValueFrom(httpClient.get('test'));

            const req = httpTesting.expectOne('test');
            req.flush('Failed!', { status: 500, statusText: 'Server Error' });

            await expect(promise).rejects.toMatchObject({ status: 500 });
        });

        it('should propagate non-401 errors', async () => {
            const promise = firstValueFrom(httpClient.get('test'));

            const req = httpTesting.expectOne('test');
            req.flush('Failed!', { status: 500, statusText: 'Server Error' });

            await expect(promise).rejects.toMatchObject({ status: 500 });
        });

        it('should propagate login request errors', async () => {
            const promise = firstValueFrom(httpClient.get('auth/login'));

            const req = httpTesting.expectOne('auth/login');
            req.flush('Failed!', { status: 401, statusText: 'Server Error' });

            await expect(promise).rejects.toMatchObject({ status: 401 });
        });
    });

    describe('Refresh Flow on 401', () => {
        it('should call AuthService for a new refresh token, then retry the request with the new access token from storage', async () => {
            // make initial request
            const promise = firstValueFrom(httpClient.get('test'));

            // return 401
            httpTesting.expectOne('test').flush('Failed!', {
                status: 401,
                statusText: 'Internal Server Error'
            });

            // expect refresh call
            expect(authService.refreshToken).toHaveBeenCalled();

            // set new token & flush async
            storageService.getAccessToken.mockReturnValue('new_access_token');
            await Promise.resolve();

            // expect retried request with new token from storage
            const refreshReq = httpTesting.expectOne('test');
            expect(refreshReq.request.headers.get('Authorization')).toBe(
                `Bearer new_access_token`
            );
            refreshReq.flush('Success!');

            await expect(promise).resolves.toBe('Success!');
        });

        it('should call logout() if refreshToken() fails', async () => {
            authService.refreshToken.mockRejectedValue('Failed!');

            // make initial request
            const promise = firstValueFrom(httpClient.get('test'));

            httpTesting.expectOne('test').flush('Failed!', {
                status: 401,
                statusText: 'Internal Server Error'
            });

            // expect refresh call
            expect(authService.refreshToken).toHaveBeenCalled();

            // flush async
            await Promise.resolve();

            // expect logout call
            expect(authService.logout).toHaveBeenCalledWith({ expired: true });
            await expect(promise).rejects.toBe('Failed!');
        });

        it('should only refresh only once on simultaneous failures and retry all requests', async () => {
            // three simulatneous requests
            firstValueFrom(httpClient.get('test1'));
            firstValueFrom(httpClient.get('test2'));
            firstValueFrom(httpClient.get('test3'));

            // reject all three with 401
            httpTesting.expectOne('test1').flush('Failed!', {
                status: 401,
                statusText: 'Internal Server Error'
            });

            httpTesting.expectOne('test2').flush('Failed!', {
                status: 401,
                statusText: 'Internal Server Error'
            });

            httpTesting.expectOne('test3').flush('Failed!', {
                status: 401,
                statusText: 'Internal Server Error'
            });

            await Promise.resolve();

            // expect a single refresh request
            expect(authService.refreshToken).toHaveBeenCalledTimes(1);

            // expect all requests to have been retried
            httpTesting.expectOne('test1');
            httpTesting.expectOne('test2');
            httpTesting.expectOne('test3');
        });
    });
});
