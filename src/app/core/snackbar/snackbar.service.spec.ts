import { TestBed } from '@angular/core/testing';

import { SnackbarService } from './snackbar.service';
import { provideValue } from '../provide';
import { MatSnackBar } from '@angular/material/snack-bar';

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
