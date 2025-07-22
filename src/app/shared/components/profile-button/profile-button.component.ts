import { TitleCasePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from 'src/app/core/api-endpoints';
import { AuthService } from '../../../core/services/auth/auth.service';
import { SnackbarService } from '../../../core/services/snackbar/snackbar.service';
import { MaterialModule } from '../../material.module';

interface UserInfoResponse {
    id: number;
    email: string;
    username: string;
}

type UserInfo = UserInfoResponse;

@Component({
    selector: 'app-profile-button',
    standalone: true,
    imports: [MaterialModule, RouterLink, TitleCasePipe],
    templateUrl: './profile-button.component.html',
    styleUrl: './profile-button.component.scss'
})
export class ProfileButtonComponent {
    private readonly _authService = inject(AuthService);
    private readonly _http = inject(HttpClient);
    private readonly _snackbar = inject(SnackbarService);

    loggedIn = this._authService.loggedIn;

    profile = resource({
        params: this.loggedIn,
        loader: () => this._fetchUser()
    });

    async logout() {
        await this._authService
            .logout()
            .then(() => this._snackbar.success('Logged out'))
            .catch((err: HttpErrorResponse) => {
                this._snackbar.error(`Logout failed ${err.status}`);
            });
    }

    private async _fetchUser(): Promise<UserInfo> {
        const response = await firstValueFrom(
            this._http.get<UserInfoResponse>(Endpoints.profile)
        );

        const parsed = this._parseUserResponse(response);
        return parsed;
    }

    private _parseUserResponse(user: UserInfoResponse): UserInfo {
        return { ...user };
    }
}
