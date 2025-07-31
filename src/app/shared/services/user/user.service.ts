import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Endpoints } from 'src/app/core/api-endpoints';

interface UniqueCheckParams {
    username?: string;
    email?: string;
}

interface UniqueCheckResponse {
    unique: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _http = inject(HttpClient);

    isUnique(params: UniqueCheckParams): Observable<boolean> {
        return this._http
            .get<UniqueCheckResponse>(Endpoints.user.checkUnique, {
                params: { ...params }
            })
            .pipe(map(({ unique }) => unique));
    }
}
