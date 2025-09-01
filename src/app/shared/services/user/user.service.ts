import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';

interface UniqueCheckParams {
    username?: string;
    email?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _http = inject(HttpClient);

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

    async updateUsername(username: string) {
        await firstValueFrom(
            this._http.post(Endpoints.user.updateUsername, { username })
        );
    }
}
