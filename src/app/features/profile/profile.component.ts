import { DatePipe, KeyValuePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RAIN_WORLD } from 'src/app/app';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from '../posts/components/post/post.component';
import { Post } from '../posts/shared/post.interface';

type UserProfile =
    | {
          id: number;
          email: string;
          username: string;
          picture: string | null;
          createdAt: Date;
          isSelf: true;
      }
    | {
          username: string;
          picture: string | null;
          createdAt: Date;
          isSelf: false;
      };

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [MaterialModule, DatePipe, PostComponent, RouterLink, KeyValuePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
    readonly rainWorld = RAIN_WORLD;

    username = input.required<string>();

    profile = httpResource<UserProfile>(() => Endpoints.user.profile(this.username()));

    posts = httpResource<Post[]>(() => ({
        url: Endpoints.post.base,
        params: { author: this.username() }
    }));

    reloadPosts() {
        this.posts.reload();
    }

    pickProfilePicture(slug: string) {
        this.profile.update((x) => ({ ...x, picture: slug }) as typeof x);
    }
}
