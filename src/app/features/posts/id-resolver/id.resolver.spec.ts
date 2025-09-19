import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { idResolver } from './id.resolver';

describe('idResolver', () => {
    const executeResolver: ResolveFn<string | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => idResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeResolver).toBeTruthy();
    });
});
