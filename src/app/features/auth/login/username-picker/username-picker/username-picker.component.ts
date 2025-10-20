import { Component, inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { UserService } from 'src/app/shared/services/user/user.service';
import { FormAsyncSuffixComponent } from '../../../shared/components/form-async-suffix/form-async-suffix.component';
import { FormErrorDirective } from '../../../shared/directives/form-error/form-error.directive';
import { asyncUniqueUserValidator } from '../../../shared/validators/unique/unique-user.validator';

@Component({
    selector: 'app-username-picker',
    standalone: true,
    imports: [MaterialModule, FormAsyncSuffixComponent, FormErrorDirective, RouterLink],
    templateUrl: './username-picker.component.html',
    styleUrl: './username-picker.component.scss'
})
export class UsernamePickerComponent {
    private readonly _userService = inject(UserService);
    private readonly _dialogRef = inject(MatDialogRef);

    username = new FormControl(
        '',
        Validators.required,
        asyncUniqueUserValidator(this._userService, 'username')
    );

    submitUsername() {
        if (!this.username.invalid && !this.username.pending) {
            this._dialogRef.close(this.username.value);
        }
    }
}
