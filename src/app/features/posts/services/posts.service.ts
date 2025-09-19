import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';

export interface NewPost {
    title: string;
    description: string;
    image: File;
    tags: string[];
}

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private readonly _httpBackend = inject(HttpBackend);
    private readonly _http = inject(HttpClient);
    private readonly _rawHttp = new HttpClient(this._httpBackend);

    async get(postId: string) {
        return await this._http.get(Endpoints.post.id(postId));
    }

    async create(post: NewPost) {
        const formData = new FormData();

        formData.append('title', post.title);
        formData.append('description', post.description);
        formData.append('image', post.image);
        formData.append('tags', post.tags.join(','));

        await firstValueFrom(this._http.post(Endpoints.post.base, formData));
    }

    async upvote(postId: string) {
        await firstValueFrom(this._http.post(Endpoints.post.upvote(postId), null));
    }

    async delete(id: string) {
        await firstValueFrom(this._http.delete(Endpoints.post.id(id)));
    }

    async fetchImageBlob(url: string): Promise<Blob> {
        return await firstValueFrom(this._rawHttp.get(url, { responseType: 'blob' }));
    }
}
