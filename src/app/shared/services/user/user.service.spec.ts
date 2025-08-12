import {
    HttpErrorResponse,
    HttpStatusCode,
    provideHttpClient
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let httpTesting: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()]
        });

        service = TestBed.inject(UserService);
        httpTesting = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTesting.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('Unique check', () => {
        it('should make a request with the correct parameters', async () => {
            const promise = service.isUnique({ username: 'name' });

            const req = httpTesting.expectOne({
                method: 'GET',
                url: `${Endpoints.user.checkUnique}?username=name`
            });

            req.flush(null);

            await expect(promise).resolves.toBe(true);
        });

        it('should return false on 409', async () => {
            const promise = service.isUnique({ username: 'name' });

            const req = httpTesting.expectOne(
                `${Endpoints.user.checkUnique}?username=name`
            );

            req.flush('Conflict', {
                status: HttpStatusCode.Conflict,
                statusText: 'Name is not unique'
            });

            await expect(promise).resolves.toBe(false);
        });

        it('should propagate any errors other than 409', async () => {
            const promise = service.isUnique({ username: 'name' });

            const req = httpTesting.expectOne(
                `${Endpoints.user.checkUnique}?username=name`
            );

            req.flush('ServerError', {
                status: HttpStatusCode.InternalServerError,
                statusText: 'Server Error!'
            });

            await expect(promise).rejects.toBeInstanceOf(HttpErrorResponse);
        });

        it('should return true on request success', async () => {
            const promise = service.isUnique({ username: 'name' });

            const req = httpTesting.expectOne(
                `${Endpoints.user.checkUnique}?username=name`
            );

            req.flush(null);

            await expect(promise).resolves.toBe(true);
        });
    });
});
