import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    convertToParamMap,
    ResolveFn,
    RouterStateSnapshot,
    UrlSegment
} from '@angular/router';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { provideValue } from 'src/app/shared/provide';
import { tokenResolver } from './token.resolver';

describe('verificationResolver', () => {
    const executeResolver: ResolveFn<string | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => tokenResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideValue(SnackbarService, { error: jest.fn() })]
        });
    });

    it('should be created', () => {
        expect(executeResolver).toBeTruthy();
    });

    it('should extract token from path params', async () => {
        const result = await executeResolver(
            ...createRoutingParams('testPath', { token: 'some token' })
        );
        expect(result).toBe('some token');
    });
});

function createRoutingParams(
    path: string,
    query: Record<string, string> = {}
): [ActivatedRouteSnapshot, RouterStateSnapshot] {
    return [
        {
            url: [new UrlSegment(path, {})],
            paramMap: convertToParamMap(query)
        } as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
    ];
}
