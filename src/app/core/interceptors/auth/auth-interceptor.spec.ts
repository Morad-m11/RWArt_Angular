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
                    handleAuthError: jest.fn().mockResolvedValue(null)
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

    describe('Error handling', () => {
        it('should not call the auth service on non 401 errors', async () => {
            const request403 = failingRequest('test', 403);
            const request409 = failingRequest('test', 409);
            const request500 = failingRequest('test', 500);

            await expect(request403).rejects.toMatchObject({ status: 403 });
            await expect(request409).rejects.toMatchObject({ status: 409 });
            await expect(request500).rejects.toMatchObject({ status: 500 });

            expect(authService.handleAuthError).not.toHaveBeenCalled();
        });

        it('should not call the auth service on auth route arrors', async () => {
            const request401 = failingRequest(Endpoints.auth.refresh, 401);

            await expect(request401).rejects.toMatchObject({ status: 401 });

            expect(authService.handleAuthError).not.toHaveBeenCalled();
        });

        it('should call the auth service on 401 errors and rethrow the original error on failure', async () => {
            authService.handleAuthError.mockRejectedValue(new Error('Woopsie'));

            const request401 = failingRequest('test', 401);
            await expect(request401).rejects.toMatchObject({ status: 401 });

            expect(authService.handleAuthError).toHaveBeenCalled();
        });

        it('should call the auth service on 401 errors and retry the request with a new token on success', async () => {
            const initialRequest = failingRequest('test', 401);

            // resolve new token
            expect(authService.handleAuthError).toHaveBeenCalled();
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
