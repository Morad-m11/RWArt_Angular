import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';

interface Post {
    title: string;
    description: string;
    imageUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private readonly _http = inject(HttpClient);

    async create(post: Post) {
        await firstValueFrom(this._http.post(Endpoints.post.create, post));
    }
}
