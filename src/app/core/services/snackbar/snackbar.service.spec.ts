import { TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { provideValue } from 'src/app/shared/provide';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
    let service: SnackbarService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideValue(MatSnackBar)]
        });
        service = TestBed.inject(SnackbarService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
