import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';
import { signupResolver } from './id.resolver';

describe('signupResolver', () => {
    const executeResolver: ResolveFn<string | null> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => signupResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeResolver).toBeTruthy();
    });
});
