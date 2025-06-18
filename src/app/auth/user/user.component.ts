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
   templateUrl: './user.component.html',
   styleUrl: './user.component.scss',
})
export class UserComponent {
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

      await this._authService
         .login(this.form.value as User)
         .catch((error: HttpErrorResponse) => this._handleError(error))
         .finally(() => this.loading.set(false));
   }

   async getProfile() {
      this.profile.set(null);

      const profile = await this._authService.fetchProfile();

      this.profile.set(profile);
   }

   private _handleError(error: HttpErrorResponse): void {
      if (error.status === HttpStatusCode.Unauthorized) {
         this.invalidCredentials.set(true);
         this.form.controls.password.setErrors({ invalid: true });
         return;
      }

      this._snackbar.open(`Login failed (${error.status})`, 'Close', { duration: 2500 });
   }
}
