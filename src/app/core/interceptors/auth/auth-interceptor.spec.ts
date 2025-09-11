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
                    refreshAuth: jest.fn().mockResolvedValue(undefined),
                    logout: jest.fn()
                }),
                provideValue(StorageService, {
                    hasAccessToken: jest.fn().mockReturnValue(true),
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
            expect(authService.refreshAuth).not.toHaveBeenCalled();
        });

        it('should do nothing if no access token is stored', async () => {
            storageService.hasAccessToken.mockReturnValue(false);

            const request = failingRequest('test', 401);
            await expect(request).rejects.toMatchObject({ status: 401 });
        });

        it('should do nothing on non-401 errors', async () => {
            const request403 = failingRequest('test', 403);
            await expect(request403).rejects.toMatchObject({ status: 403 });

            const request500 = failingRequest('test', 500);
            await expect(request500).rejects.toMatchObject({ status: 500 });
        });

        it('should do nothing on 401 errors to auth routes', async () => {
            const promise = failingRequest('auth/login', 401);
            await expect(promise).rejects.toMatchObject({ status: 401 });
        });
    });

    describe('Refresh Flow on 401', () => {
        it('should throw the original error on access refresh failure', async () => {
            authService.refreshAuth.mockRejectedValue('Failed!');

            const request = failingRequest('test', 401);
            await expect(request).rejects.toMatchObject({ status: 401 });

            expect(authService.refreshAuth).toHaveBeenCalled();
        });

        it('should logout if the refresh fails', async () => {
            authService.refreshAuth.mockRejectedValue('Failed!');

            const request = failingRequest('test', 401);
            await expect(request).rejects.toMatchObject({ status: 401 });

            expect(authService.logout).toHaveBeenCalledWith({ expired: true });
        });

        it('should request a new access token and retry on success', async () => {
            const initialRequest = failingRequest('test', 401);

            // resolve new token
            expect(authService.refreshAuth).toHaveBeenCalled();
            storageService.getAccessToken.mockReturnValue('new_access_token');

            // flush request
            await Promise.resolve();

            // expect retried request with new token
            httpTesting
                .expectOne(
                    (req) =>
                        req.url === 'test' &&
                        req.headers.get('Authorization') === 'Bearer new_access_token'
                )
                .flush('Success!');

            await expect(initialRequest).resolves.toBe('Success!');
        });

        it('should only refresh only once on simultaneous failures and retry all requests in order', async () => {
            request('test1');
            request('test2');
            request('test3');

            expectAndFlush('test1', 401);
            expectAndFlush('test2', 401);
            expectAndFlush('test3', 401);

            await Promise.resolve();

            // expect a single refresh request
            expect(authService.refreshAuth).toHaveBeenCalledTimes(1);

            // expect all requests to have been retried
            expectAndFlush('test1');
            expectAndFlush('test2');
            expectAndFlush('test3');
        });
    });

    /**
     * Fires and flushes a failing GET request.
     */
    function failingRequest(url: string, status: number) {
        const promise = request(url);
        expectAndFlush(url, status);
        return promise;
    }

    function request(url: string): Promise<unknown> {
        return firstValueFrom(httpClient.get(url));
    }

    function expectAndFlush(url: string, status = 200) {
        httpTesting.expectOne(url).flush('Failed!', { status, statusText: 'idk' });
    }
});
