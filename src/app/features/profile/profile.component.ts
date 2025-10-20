import { DatePipe } from '@angular/common';
import { HttpErrorResponse, httpResource } from '@angular/common/http';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Endpoints } from 'src/app/core/constants/api-endpoints';
import { SnackbarService } from 'src/app/core/services/snackbar/snackbar.service';
import { assert } from 'src/app/shared/assert';
import { MaterialModule } from 'src/app/shared/material.module';
import {
    OwnedUser,
    UserProfile,
    UserService
} from 'src/app/shared/services/user/user.service';
import { PostComponent } from '../posts/components/post/post.component';
import { Post } from '../posts/shared/post.interface';
import { EditDialogComponent, EditDialogData } from './edit-dialog/edit-dialog.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [MaterialModule, DatePipe, PostComponent, RouterLink],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
    private readonly _snackbar = inject(SnackbarService);
    private readonly _userService = inject(UserService);
    private readonly _dialog = inject(MatDialog);

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

    async openEditdialog() {
        assert(
            this.profile.hasValue() && this.profile.value().isSelf,
            'invalid profile access on edit'
        );

        const { id, picture, username } = this.profile.value() as OwnedUser;
        const dialogRef = this._dialog.open(EditDialogComponent, {
            autoFocus: false,
            data: { picture, username } as EditDialogData
        });

        const newProfile = await firstValueFrom<EditDialogData>(dialogRef.afterClosed());
        if (!newProfile) {
            return;
        }

        await this.updateProfile(id, newProfile);
    }

    private async updateProfile(
        profileId: number,
        changes: { picture: string; username: string }
    ) {
        try {
            await this._userService.update(profileId, changes);
            this.profile.update((x) => ({ ...x, ...changes }) as typeof x);
        } catch (error) {
            const status = (error as HttpErrorResponse).status;
            this._snackbar.error(`Could not update avatar (${status})`);
        }
    }
}
