import { DatePipe, TitleCasePipe } from '@angular/common';
import { httpResource, HttpResourceRequest } from '@angular/common/http';
import { Component, computed, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, JWTResponse, UserInfo } from '../auth/auth.service';
import { MaterialModule } from '../material.module';

@Component({
   selector: 'app-profile',
   standalone: true,
   imports: [MaterialModule, RouterLink, TitleCasePipe, DatePipe],
   templateUrl: './profile.component.html',
   styleUrl: './profile.component.scss'
})
export class ProfileComponent {
   private readonly _authService = inject(AuthService);

   loggedIn = this._authService.loggedIn;

   profile = httpResource<UserInfo>(
      () =>
         ({
            url: 'http://localhost:3000/auth/me',
            parse: (userJWT: JWTResponse) => this._parseUserResponse
         }) as HttpResourceRequest
   );

   constructor() {
      effect(() => {
         const loggedIn = this.loggedIn();

         if (loggedIn) {
            this.profile.reload();
         }
      });
   }

   logout() {
      this._authService.logout();
   }

   private _parseUserResponse(userJWT: JWTResponse): UserInfo {
      const issuedInMS = userJWT.iat * 1000;
      const expiresInMS = userJWT.exp * 1000;

      const userInfo: UserInfo = {
         username: userJWT.username,
         issued: issuedInMS,
         expires: expiresInMS
      };

      return userInfo;
   }
}
