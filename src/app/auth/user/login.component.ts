import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackbarService } from 'src/app/core/snackbar/snackbar.service';
import { MaterialModule } from '../../material.module';
import { AuthService } from '../auth.service';

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
   imports: [MaterialModule],
   templateUrl: './login.component.html',
   styleUrl: './login.component.scss'
})
export class LoginComponent {
   private readonly _authService = inject(AuthService);
   private readonly _snackbar = inject(SnackbarService);

   loading = signal(false);
   invalidCredentials = signal(false);

   form = new FormGroup<UserForm>({
      username: new FormControl('', {
         nonNullable: true,
         validators: Validators.required
      }),
      password: new FormControl('', {
         nonNullable: true,
         validators: Validators.required
      })
   });

   async login() {
      this.loading.set(true);
      this.invalidCredentials.set(false);

      const user = this.form.value as User;
      await this._authService
         .login(user)
         .then(() => this._snackbar.success(`Welcome ${user.username}`))
         .catch((error: HttpErrorResponse) => this._handleError(error))
         .finally(() => this.loading.set(false));
   }

   private _handleError(error: HttpErrorResponse): void {
      if (error.status === HttpStatusCode.Unauthorized) {
         this.invalidCredentials.set(true);
         this.form.controls.password.setErrors({ invalid: true });
         return;
      }

      this._snackbar.error(`Login failed (${error.status})`);
   }
}
