import {
    HttpClient,
    HttpErrorResponse,
    httpResource,
    HttpStatusCode
} from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, finalize, firstValueFrom, Observable, shareReplay, tap } from 'rxjs';
import { SignInProvider } from 'src/app/features/auth/shared/signin-provider-type';
import { UserService } from 'src/app/shared/services/user/user.service';
import { Endpoints } from '../../constants/api-endpoints';
import { CoreSnackbarMessages } from '../../constants/snackbar-messages';
import { SnackbarService } from '../snackbar/snackbar.service';
import { StorageService } from '../storage/storage.service';

interface SignupRequestBody {
    email: string;
    username: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
    username: string;
    picture: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly _http = inject(HttpClient);
    private readonly _storage = inject(StorageService);
    private readonly _snackbar = inject(SnackbarService);
    private readonly _userService = inject(UserService);

    private _refreshRequest$: Observable<unknown> | null = null;

    private _me = httpResource<AuthUser>(() => {
        this._userService.updated();
        return Endpoints.auth.me;
    });
    private _me$ = toObservable(this._me.status);

    isLoggedIn = signal(this._storage.hasAccessToken());
    userProfile = computed(() => (this._me.hasValue() ? this._me.value() : null));

    constructor() {
        effect(() => {
            if (this.isLoggedIn()) {
                this._me.reload();
            } else {
                this._me.set(undefined);
            }
        });

        effect(() => {
            if (this._me.error()) {
                this.isLoggedIn.set(false);
                this._storage.clearAccessToken();
            }
        });
    }

    async waitForAuth(): Promise<unknown> {
        return await firstValueFrom(
            this._me$.pipe(
                filter((status) => status !== 'loading' && status !== 'reloading')
            )
        );
    }

    async refreshAuth(): Promise<unknown> {
        if (!this._refreshRequest$) {
            this._refreshRequest$ = this._http
                .post<{ accessToken: string }>(Endpoints.auth.refresh, null)
                .pipe(
                    tap({
                        next: ({ accessToken }) =>
                            this._storage.setAccessToken(accessToken),
                        error: () => this.logout({ expired: true })
                    }),
                    shareReplay(1),
                    finalize(() => (this._refreshRequest$ = null))
                );
        }

        return firstValueFrom(this._refreshRequest$);
    }

    async handleAuthError(error: HttpErrorResponse): Promise<unknown> {
        const hasAccessToken = this._storage.getAccessToken();
        const is401 = error.status === HttpStatusCode.Unauthorized;

        if (hasAccessToken && is401) {
            return this.refreshAuth();
        }

        throw error;
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
        provider: SignInProvider,
        token: string,
        nameForNewUser?: string
    ): Promise<void> {
        const url = Endpoints.auth.login[provider];

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
                (error) => console.error(error)
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
