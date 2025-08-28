import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from '../../constants/api-endpoints';
import { CoreSnackbarMessages } from '../../constants/snackbar-messages';
import { SnackbarService } from '../snackbar/snackbar.service';
import { StorageService } from '../storage/storage.service';

export interface UserInfo {
    id: number;
    email: string;
    username: string;
}

interface SignupRequestBody {
    email: string;
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _storage = inject(StorageService);
    private readonly _snackbar = inject(SnackbarService);

    profile = httpResource<UserInfo>(() =>
        this.isLoggedIn() ? Endpoints.user.profile : undefined
    );

    isLoggedIn = signal(!!this._storage.getAccessToken());

    async login(username: string, password: string): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.login, {
                username,
                password
            })
        );

        this._storage.setAccessToken(accessToken);
        this.isLoggedIn.set(true);
    }

    async logout(opts?: { expired: boolean }): Promise<void> {
        if (opts?.expired) {
            this._snackbar.error(CoreSnackbarMessages.expired);
        } else {
            await firstValueFrom(this._http.post(Endpoints.auth.logout, null));
        }

        this._storage.clearAccessToken();
        this.isLoggedIn.set(false);
    }

    async signup(body: SignupRequestBody) {
        await firstValueFrom(this._http.post(Endpoints.auth.signup, body));
    }

    async resendVerification(username: string) {
        await firstValueFrom(
            this._http.post(Endpoints.auth.resendVerification, { username })
        );
    }

    async recoverAccount(email: string): Promise<void> {
        await firstValueFrom(this._http.post(Endpoints.auth.forgotPassword, { email }));
    }

    async resetPassword(pass: string, token: string) {
        await firstValueFrom(
            this._http.post(Endpoints.auth.resetPassword, { password: pass, token })
        );
    }

    async refreshToken(): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.refresh, null)
        );

        this._storage.setAccessToken(accessToken);
    }
}
