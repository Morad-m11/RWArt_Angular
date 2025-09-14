import { DatePipe } from '@angular/common';
import { httpResource } from '@angular/common/http';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { MaterialModule } from 'src/app/shared/material.module';
import { PostComponent } from '../posts/post/post.component';
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
    imports: [MaterialModule, DatePipe, PostComponent, RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
    username = input.required<string>();

    profile = httpResource<UserProfile>(() => Endpoints.user.profile(this.username()));

    posts = httpResource<Post[]>(() => ({
        url: Endpoints.post.list,
        params: { author: this.username() }
    }));
}
