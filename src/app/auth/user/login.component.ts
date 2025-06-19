import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JsonPipe } from '@angular/common';

export interface User {
   username: string;
   password: string;
}

type UserForm = {
   [K in keyof User]: FormControl<User[K]>;
};

@Component({
   selector: 'app-user',
   standalone: true,
   imports: [MaterialModule, JsonPipe],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss',
})
export class LoginComponent {
   private readonly _authService = inject(AuthService);
   private readonly _snackbar = inject(MatSnackBar);

   loading = signal(false);
   invalidCredentials = signal(false);
   profile = signal<unknown | null>(null);

   form = new FormGroup<UserForm>({
      username: new FormControl('', {
         nonNullable: true,
         validators: Validators.required,
      }),
      password: new FormControl('', {
         nonNullable: true,
         validators: Validators.required,
      }),
   });

   async login() {
      this.loading.set(true);
      this.invalidCredentials.set(false);

      const user = this.form.value as User;
      await this._authService
         .login(user)
         .then(() => this._displaySuccessNotification(`Welcome ${user.username}`))
         .catch((error: HttpErrorResponse) => this._handleError(error))
         .finally(() => this.loading.set(false));
   }

   async getProfile() {
      this.profile.set(null);

      await this._authService
         .fetchProfile()
         .then((profile) => this.profile.set(profile))
         .catch(() => this._displayErrorNotification('Failed to load profile'));
   }

   private _displaySuccessNotification(message: string) {
      return this._snackbar.open(message, undefined, {
         duration: 2000,
         verticalPosition: 'top',
      });
   }

   private _displayErrorNotification(message: string) {
      this._snackbar.open(message, 'Close', {
         duration: 2500,
         verticalPosition: 'top',
      });
   }

   private _handleError(error: HttpErrorResponse): void {
      if (error.status === HttpStatusCode.Unauthorized) {
         this.invalidCredentials.set(true);
         this.form.controls.password.setErrors({ invalid: true });
         return;
      }

      this._displayErrorNotification(`Login failed (${error.status})`);
   }
}
