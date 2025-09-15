import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { redirectResolver } from './redirect.resolver';

describe('redirectResolver', () => {
    const executeResolver: ResolveFn<string | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => redirectResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeResolver).toBeTruthy();
    });
});
