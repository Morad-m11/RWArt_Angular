import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private readonly _tokenKey = 'access_token';

    setAccessToken(value: string): void {
        localStorage.setItem(this._tokenKey, value);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(this._tokenKey);
    }

    clearAccessToken(): void {
        localStorage.removeItem(this._tokenKey);
    }
}
