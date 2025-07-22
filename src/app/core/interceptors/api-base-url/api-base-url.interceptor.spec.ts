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
import { environment } from 'src/environments/environment';
import { apiBaseUrlInterceptor } from './api-base-url.interceptor';

describe('apiBaseUrlInterceptor', () => {
    let httpClient: HttpClient;
    let httpTesting: HttpTestingController;

    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => apiBaseUrlInterceptor(req, next));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([apiBaseUrlInterceptor])),
                provideHttpClientTesting()
            ]
        });

        httpClient = TestBed.inject(HttpClient);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should prepend base url from environment to each call', async () => {
        const promise = firstValueFrom(httpClient.get('test'));
        const req = httpTesting.expectOne(`${environment.baseUrl}/test`);

        req.flush(null);

        await expect(promise).resolves.toBeNull();
    });
});
