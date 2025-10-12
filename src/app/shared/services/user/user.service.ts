import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';

interface UniqueCheckParams {
    username?: string;
    email?: string;
}

interface OwnedUser {
    id: number;
    email: string;
    username: string;
    picture: string;
    createdAt: Date;
    isSelf: true;
}

interface ForeignUser {
    username: string;
    picture: string;
    createdAt: Date;
    isSelf: false;
}

export type UserProfile = OwnedUser | ForeignUser;

export type UserUpdate = Partial<Pick<UserProfile, 'username' | 'picture'>>;

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _http = inject(HttpClient);

    updated = signal({});

    async isUnique(params: UniqueCheckParams): Promise<boolean> {
        return await firstValueFrom(
            this._http.get(Endpoints.user.checkUnique, { params: { ...params } }).pipe(
                map(() => true),
                catchError((error: HttpErrorResponse) => {
                    if (error.status === HttpStatusCode.Conflict) {
                        return of(false);
                    }

                    throw error;
                })
            )
        );
    }

    async update(id: number, user: UserUpdate) {
        await firstValueFrom(this._http.patch(Endpoints.user.id(id), user));
        this.updated.set(user);
    }
}
