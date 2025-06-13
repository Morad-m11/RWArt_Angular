import { httpResource } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MaterialModule } from '../material.module';

interface PostResponse {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

// interface Post {
//   id: string;
//   author: string;
//   name: string;
// }

const IMAGE_URL = 'https://jsonplaceholder.typicode.com/photos';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export default class PostsComponent {
  postIndex = signal(1);

  imageRef = httpResource<PostResponse>(() => `${IMAGE_URL}/${this.postIndex()}`);
  // post = httpResource<Post>(() => this.imageRef.value()?.url);

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
