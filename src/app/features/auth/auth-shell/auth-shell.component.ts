import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-auth-shell',
    standalone: true,
    imports: [MaterialModule, RouterOutlet],
    templateUrl: './auth-shell.component.html',
    styleUrl: './auth-shell.component.scss'
})
export class AuthShellComponent {
    private readonly _router = inject(Router);
    private readonly _route = inject(ActivatedRoute);

    titles = {
        login: 'Welcome! Please login',
        signup: 'Welcome! Please create your account below',
        forgot: "Enter your Email below and I'll send you a recovery code :)"
    };

    title = toSignal(
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            switchMap(() => this._route.firstChild?.url ?? []),
            map((url) => url.at(-1)?.path),
            filter((path) => !!path),
            map((path) => this.titles[path as keyof typeof this.titles])
        )
    );
}
