import { inject, Injectable } from '@angular/core';
import { User } from './user/login.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { SnackbarService } from '../core/snackbar/snackbar.service';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   private readonly _http = inject(HttpClient);
   private readonly _router = inject(Router);
   private readonly _snackbar = inject(SnackbarService);

   async login(user: User) {
      await firstValueFrom(this._http.post('http://localhost:3000/auth/login', user));
   }

   logout({ expired } = { expired: false }) {
      if (expired) {
         this._snackbar.error('Session expired');
      } else {
         this._http.post('http://localhost:3000/auth/logout', null);
      }

      this._router.navigateByUrl('login');
   }
}
