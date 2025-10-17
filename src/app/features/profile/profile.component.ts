import { DatePipe, KeyValuePipe } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { MaterialModule } from 'src/app/shared/material.module';
import { RAIN_WORLD } from 'src/app/shared/rainworld';
import { UserProfile, UserService } from 'src/app/shared/services/user/user.service';
import { UsernamePickerComponent } from '../auth/login/username-picker/username-picker/username-picker.component';
import { PostComponent } from '../posts/components/post/post.component';
import { Post } from '../posts/shared/post.interface';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [MaterialModule, DatePipe, PostComponent, RouterLink, KeyValuePipe],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
    private readonly _snackbar = inject(SnackbarService);
    private readonly _userService = inject(UserService);
    private readonly _dialog = inject(MatDialog);
    private readonly _router = inject(Router);

    readonly rainWorld = RAIN_WORLD;

    username = input.required<string>();

    profile = httpResource<UserProfile>(() => Endpoints.user.profile(this.username()));
    posts = httpResource<Post[]>(() => ({
        url: Endpoints.post.base,
        params: { author: this.username() }
    }));

    errorMessage = computed(() => {
        if ((this.profile.error() as HttpErrorResponse).status === 404) {
            return 'But nobody came.';
        }

        return `Failed to fetch profile for '${this.username()}'.`;
    });

    reloadPosts() {
        this.posts.reload();
    }

    async pickProfilePicture(slug: string) {
        const profile = this.profile.value();

        if (!profile?.isSelf) {
            return;
        }

        try {
            await this._userService.update(profile.id, { picture: slug });
            this.profile.update((x) => ({ ...x, picture: slug }) as typeof x);
        } catch (error) {
            const status = (error as HttpErrorResponse).status;
            this._snackbar.error(`Could not update avatar (${status})`);
        }
    }

    async pickUsername() {
        const profile = this.profile.value();

        if (!profile?.isSelf) {
            return;
        }

        const username = await firstValueFrom<string | undefined>(
            this._dialog.open(UsernamePickerComponent).afterClosed()
        );

        if (!username) {
            return;
        }

        try {
            await this._userService.update(profile.id, { username });
            this.profile.update((x) => ({ ...x, username }) as typeof x);
            await this._router.navigate(['/user', username], { replaceUrl: true });
        } catch (error) {
            const status = (error as HttpErrorResponse).status;
            this._snackbar.error(`Could not update username (${status})`);
        }
    }
}
