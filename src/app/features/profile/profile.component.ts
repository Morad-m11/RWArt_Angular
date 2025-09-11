import { Component, computed, inject } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export default class ProfileComponent {
    private readonly _authService = inject(AuthService);

    profile = computed(() => this._authService.me.value());
}
