import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Endpoints } from 'src/app/core/api-endpoints';

type UniqueCheckParams = { name: string } | { email: string };

interface UniqueCheckResponse {
    exists: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private _http = inject(HttpClient);

    isUnique(value: string): Observable<boolean> {
        const params: UniqueCheckParams = { name: value };

        return this._http
            .get<UniqueCheckResponse>(Endpoints.user.checkUnique, { params })
            .pipe(map(({ exists }) => !exists));
    }
}
