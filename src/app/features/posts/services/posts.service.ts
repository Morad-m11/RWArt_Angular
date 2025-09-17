import { HttpClient } from '@angular/common/http';
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
    private readonly _http = inject(HttpClient);

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
        await firstValueFrom(this._http.delete(Endpoints.post.edit(id)));
    }
}
