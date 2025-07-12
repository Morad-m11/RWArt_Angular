import { Component, inject, resource, signal } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';
import { ImageService } from '../image-service/image.service';

@Component({
   selector: 'app-posts',
   standalone: true,
   imports: [MaterialModule],
   templateUrl: './posts.component.html',
   styleUrl: './posts.component.scss'
})
export default class PostsComponent {
   private readonly _imageService = inject(ImageService);

   postIndex = signal(1);
   imageRef = resource({
      params: this.postIndex,
      loader: ({ params }) => this._imageService.get(params)
   });

   previous() {
      this.postIndex.update((x) => Math.max(0, x - 1));
   }

   next() {
      this.postIndex.update((x) => x + 1);
   }

   randomizePost() {
      const max = 10;
      this.postIndex.set(Math.floor(Math.random() * max));
   }
}
