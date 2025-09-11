import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { Endpoints } from '../../constants/api-endpoints';
import { CoreSnackbarMessages } from '../../constants/snackbar-messages';
import { SnackbarService } from '../snackbar/snackbar.service';
import { StorageService } from '../storage/storage.service';

export interface UserInfo {
    id: number;
    email: string;
    username: string;
    picture?: string | null;
}

export type SignInProvider = 'google';

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

    me = httpResource<UserInfo>(() =>
        this.isLoggedIn() ? Endpoints.auth.me : undefined
    );
    me$ = toObservable(this.me.status);

    isLoggedIn = signal(this._storage.hasAccessToken());

    async waitForAuth(): Promise<void> {
        const currentStatus = this.me.status();

        if (currentStatus !== 'loading' && currentStatus !== 'reloading') {
            return;
        }

        await firstValueFrom(
            this.me$.pipe(
                filter((status) => status !== 'loading' && status !== 'reloading')
            )
        );
    }

    async refreshAuth(): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.refresh, null)
        );

        this._storage.setAccessToken(accessToken);
    }

    async login(username: string, password: string): Promise<void> {
        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(Endpoints.auth.login.local, {
                username,
                password
            })
        );

        this._storage.setAccessToken(accessToken);
        this.isLoggedIn.set(true);
    }

    async thirdPartyLogin(
        _provider: string,
        token: string,
        nameForNewUser?: string
    ): Promise<void> {
        const url = Endpoints.auth.login.google;

        const { accessToken } = await firstValueFrom(
            this._http.post<{ accessToken: string }>(url, {
                token,
                username: nameForNewUser
            })
        );

        this._storage.setAccessToken(accessToken);
        this.isLoggedIn.set(true);
    }

    async logout(opts?: { expired: boolean }): Promise<void> {
        if (opts?.expired) {
            this._snackbar.error(CoreSnackbarMessages.expired);
        } else {
            await firstValueFrom(this._http.post(Endpoints.auth.logout, null)).catch(
                (error: HttpErrorResponse) => {
                    if (error.status !== 401) {
                        throw error;
                    }
                }
            );
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
}
