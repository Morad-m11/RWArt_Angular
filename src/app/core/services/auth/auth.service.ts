import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Credentials } from 'src/app/features/login/login.component';
import { Endpoints } from '../../api-endpoints';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../constants';
import { SnackbarService } from '../snackbar/snackbar.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _router = inject(Router);
    private readonly _snackbar = inject(SnackbarService);

    loggedIn = signal(false);

    async login(credentials: Credentials): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.login, credentials)
        );

        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        this.loggedIn.set(true);
    }

    async logout(opts?: { expired: boolean }): Promise<void> {
        if (opts?.expired) {
            this._snackbar.error('Session expired');
        } else {
            await firstValueFrom(this._http.post(Endpoints.auth.logout, null));
        }

        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
        this.loggedIn.set(false);
        this._router.navigateByUrl('login');
    }

    async refreshToken(): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.refresh, null)
        );

        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
    }
}
