import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface PostResponse {
   albumId: number;
   id: number;
   title: string;
   url: string;
   thumbnailUrl: string;
}

@Injectable({
   providedIn: 'root',
})
export class ImageService {
   private readonly _http = inject(HttpClient);

   async get(index: number): Promise<PostResponse> {
      return await firstValueFrom(
         this._http.get<PostResponse>(`http://localhost:3000/image/${index}`)
      );
   }
}
