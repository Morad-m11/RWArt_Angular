import {
    HttpClient,
    HttpInterceptorFn,
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { provideValue } from 'src/app/shared/provide';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../constants';
import { AuthService } from '../../services/auth/auth.service';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
    let httpClient: HttpClient;
    let httpTesting: HttpTestingController;
    let authService: AuthService;

    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => authInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideValue(AuthService, {
                    refreshToken: jest.fn().mockResolvedValue(undefined),
                    logout: jest.fn()
                }),
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting()
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
        authService = TestBed.inject(AuthService);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    describe('Auth Flow', () => {
        it('should attach Authorization header with access token from storage', async () => {
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'test_access_token');

            const promise = firstValueFrom(
                httpClient.get('test', { headers: { custom: 'foo' } })
            );

            const req = httpTesting.expectOne('test');

            expect(req.request.headers.get('custom')).toBe('foo');
            expect(req.request.headers.get('Authorization')).toBe(
                'Bearer test_access_token'
            );
            expect(req.request.withCredentials).toBe(true);

            req.flush(null);
            await expect(promise).resolves.toBeNull();
        });
    });

    describe('Error propagation', () => {
        afterEach(() => {
            expect(authService.refreshToken).not.toHaveBeenCalled();
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
            const req = httpTesting.expectOne('test');

            // return 401
            req.flush('Failed!', { status: 401, statusText: 'Internal Server Error' });

            // expect refresh call
            expect(authService.refreshToken).toHaveBeenCalled();

            // set new token & flush async
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, 'new_access_token');
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
            (authService.refreshToken as jest.Mock).mockRejectedValue('Failed!');

            // make initial request
            const promise = firstValueFrom(httpClient.get('test'));
            const req = httpTesting.expectOne('test');

            // return 401
            req.flush('Failed!', { status: 401, statusText: 'Internal Server Error' });

            // expect refresh call
            expect(authService.refreshToken).toHaveBeenCalled();

            // flush async
            await Promise.resolve();

            // expect logout call
            expect(authService.logout).toHaveBeenCalledWith({ expired: true });
            await expect(promise).rejects.toBe('Failed!');
        });
    });
});
