import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { SnackbarService } from '../core/snackbar/snackbar.service';
import { Credentials } from './user/login.component';

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

   async logout(opts?: { expired: boolean }): Promise<void> {
      if (opts?.expired) {
         this._snackbar.error('Session expired');
      } else {
         await firstValueFrom(this._http.post('http://localhost:3000/auth/logout', null));
      }

      this.loggedIn.set(false);
      this._router.navigateByUrl('login');
   }
}
