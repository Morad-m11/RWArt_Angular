import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService, UserInfo } from '../auth/auth.service';
import { SnackbarService } from '../core/snackbar/snackbar.service';
import { MaterialModule } from '../material.module';

interface JWTResponse {
   username: string;
   sub: number;
   iat: number;
   exp: number;
}

@Component({
   selector: 'app-profile',
   standalone: true,
   imports: [MaterialModule, RouterLink, TitleCasePipe, DatePipe],
   templateUrl: './profile.component.html',
   styleUrl: './profile.component.scss'
})
export class ProfileComponent {
   private readonly _authService = inject(AuthService);
   private readonly _http = inject(HttpClient);
   private readonly _snackbar = inject(SnackbarService);

   loggedIn = this._authService.loggedIn;

   profile = resource({
      params: this.loggedIn,
      loader: () => this._fetchUser()
   });

   private async _fetchUser(): Promise<UserInfo> {
      const response = await firstValueFrom(
         this._http.get<JWTResponse>('http://localhost:3000/auth/me')
      );

      const parsed = this._parseUserResponse(response);
      return parsed;
   }

   logout() {
      this._authService.logout().catch((err: HttpErrorResponse) => {
         this._snackbar.error(`Logout failed ${err.status}`);
      });
   }

   private _parseUserResponse(userJWT: JWTResponse): UserInfo {
      const issuedInMS = userJWT.iat * 1000;
      const expiresInMS = userJWT.exp * 1000;

      return {
         username: userJWT.username,
         issued: issuedInMS,
         expires: expiresInMS
      };
   }
}
