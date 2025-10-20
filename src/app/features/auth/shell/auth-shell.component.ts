import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouterLink,
    RouterOutlet
} from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-auth-shell',
    standalone: true,
    imports: [MaterialModule, RouterOutlet, RouterLink],
    templateUrl: './auth-shell.component.html',
    styleUrl: './auth-shell.component.scss'
})
export class AuthShellComponent {
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    titles = {
        login: 'Welcome! Please login',
        signup: 'Welcome! Please create your account',
        'forgot-password': 'Enter your Email to receive a recovery code',
        'reset-password': 'Enter a new password'
    };

    showBackButton = computed(() => this.title() !== this.titles.login);
    title = computed(() => this.titles[this.currentPath() as keyof typeof this.titles]);

    currentPath = toSignal(
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            switchMap(() => this._route.firstChild?.url ?? []),
            map((url) => url.at(0)?.path),
            filter((path) => !!path)
        )
    );
}
