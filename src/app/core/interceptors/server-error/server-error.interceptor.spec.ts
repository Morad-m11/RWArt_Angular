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
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { serverErrorInterceptor } from './server-error.interceptor';

describe('serverErrorInterceptor', () => {
    let httpClient: HttpClient;
    let httpTesting: HttpTestingController;

    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => serverErrorInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideValue(SnackbarService, { error: jest.fn() }),
                provideHttpClient(withInterceptors([serverErrorInterceptor])),
                provideHttpClientTesting()
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should propagate all errors', async () => {
        const promise = firstValueFrom(httpClient.get('test'));

        const req = httpTesting.expectOne('test');
        req.flush('Failed!', { status: 404, statusText: 'Not Found' });

        await expect(promise).rejects.toMatchObject({
            status: 404,
            statusText: 'Not Found'
        });
    });

    it('should open a snackbar on connection errors and propagate', async () => {
        const snackbar = TestBed.inject(SnackbarService);
        const promise = firstValueFrom(httpClient.get('test'));

        const req = httpTesting.expectOne('test');
        req.flush('Failed!', { status: 0, statusText: '' });

        await expect(promise).rejects.toMatchObject({ status: 0 });
        expect(snackbar.error).toHaveBeenCalled();
    });
});
