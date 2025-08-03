import { TestBed } from '@angular/core/testing';
import {
    ActivatedRouteSnapshot,
    convertToParamMap,
    ResolveFn,
    RouterStateSnapshot,
    UrlSegment
} from '@angular/router';
import { tokenResolver } from './verification.resolver';

describe('verificationResolver', () => {
    const executeResolver: ResolveFn<string | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => tokenResolver(...resolverParameters));

    it('should be created', () => {
        expect(executeResolver).toBeTruthy();
    });

    it('should return null when token is missing', async () => {
        const result = await executeResolver(...createRoutingParams('testPath'));
        expect(result).toBeNull();
    });

    it('should extract token from query params', async () => {
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
            queryParamMap: convertToParamMap(query)
        } as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
    ];
}
