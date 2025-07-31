import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';
import { authRoutesGuard } from './auth-routes.guard';

describe('guardsGuard', () => {
    const executeGuard: CanMatchFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authRoutesGuard(...guardParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
