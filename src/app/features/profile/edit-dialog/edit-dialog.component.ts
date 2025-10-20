import { Component, inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/shared/material.module';
import { RAIN_WORLD } from 'src/app/shared/rainworld';
import { UserService } from 'src/app/shared/services/user/user.service';
import { FormAsyncSuffixComponent } from '../../auth/shared/components/form-async-suffix/form-async-suffix.component';
import { FormErrorDirective } from '../../auth/shared/directives/form-error/form-error.directive';
import { asyncUniqueUserValidator } from '../../auth/shared/validators/unique/unique-user.validator';

export interface EditDialogData {
    picture: string;
    username: string;
}

@Component({
    selector: 'app-edit-dialog',
    standalone: true,
    imports: [MaterialModule, FormErrorDirective, FormAsyncSuffixComponent],
    templateUrl: './edit-dialog.component.html',
    styleUrl: './edit-dialog.component.scss'
})
export class EditDialogComponent {
    private readonly _userService = inject(UserService);
    readonly data = inject<EditDialogData>(MAT_DIALOG_DATA);
    readonly avatars = Object.values(RAIN_WORLD)
        .flat()
        .map((x) => x.icon);

    form = new FormGroup({
        picture: new FormControl(this.data.picture, { nonNullable: true }),
        username: new FormControl(this.data.username, {
            nonNullable: true,
            asyncValidators: asyncUniqueUserValidator(this._userService, 'username')
        })
    });

    setAvatar(avatar: string) {
        this.form.controls.picture.setValue(avatar);
    }
}
