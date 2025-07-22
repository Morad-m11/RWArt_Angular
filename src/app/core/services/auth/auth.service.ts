import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Credentials } from 'src/app/features/login/login.component';
import { Endpoints } from '../../api-endpoints';
import { ACCESS_TOKEN_STORAGE_KEY } from '../../constants';
import { CoreSnackbarMessages } from '../../messages';
import { SnackbarService } from '../snackbar/snackbar.service';

export interface UserInfo {
    id: number;
    email: string;
    username: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _snackbar = inject(SnackbarService);

    profile = httpResource<UserInfo>(() =>
        this.loggedIn() ? Endpoints.profile : undefined
    );

    loggedIn = signal(!!this._getAccessToken());

    async login(credentials: Credentials): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.login, credentials)
        );

        this._setAccessToken(accessToken);
        this.loggedIn.set(true);
    }

    async logout(opts?: { expired: boolean }): Promise<void> {
        if (opts?.expired) {
            this._snackbar.error(CoreSnackbarMessages.expired);
        } else {
            await firstValueFrom(this._http.post(Endpoints.auth.logout, null));
        }

        this._clearAccessToken();
        this.loggedIn.set(false);
    }

    async refreshToken(): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.refresh, null)
        );

        this._setAccessToken(accessToken);
    }

    private _getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
    }

    private _setAccessToken(value: string): void {
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, value);
    }

    private _clearAccessToken(): void {
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
    }
}
