import { inject, Injectable } from '@angular/core';
import { User } from './user/login.component';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
   providedIn: 'root',
})
export class AuthService {
   private readonly _http = inject(HttpClient);

   async login(user: User) {
      await firstValueFrom(
         this._http.post('http://localhost:3000/auth/login', user, {
            withCredentials: true,
         })
      );
   }

   async fetchProfile() {
      return await firstValueFrom(
         this._http.get('http://localhost:3000/auth/profile', { withCredentials: true })
      );
   }
}
