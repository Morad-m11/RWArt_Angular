import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, switchMap } from 'rxjs';
import { SnackbarService } from '../core/snackbar/snackbar.service';
import { Credentials } from './user/login.component';

export interface JWTResponse {
   username: string;
   sub: number;
   iat: number;
   exp: number;
}

export interface UserInfo {
   username: string;
   issued: number;
   expires: number;
}

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   private readonly _http = inject(HttpClient);
   private readonly _router = inject(Router);
   private readonly _snackbar = inject(SnackbarService);

   loggedIn = signal(false);

   async login(credentials: Credentials): Promise<void> {
      await firstValueFrom(
         this._http.post<void>('http://localhost:3000/auth/login', credentials)
      );
      this.loggedIn.set(true);
   }

   logout({ expired } = { expired: false }): void {
      if (expired) {
         this._snackbar.error('Session expired');
      } else {
         firstValueFrom(this._http.post('http://localhost:3000/auth/logout', null)).catch(
            (error) => {}
         );
      }

      this.loggedIn.set(false);
      this._router.navigateByUrl('login');
   }
}
