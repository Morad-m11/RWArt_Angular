import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProfileButtonComponent } from 'src/app/shared/components/profile-button/profile-button.component';
import { MaterialModule } from 'src/app/shared/material.module';

interface Link {
    label: string;
    path: string;
}

@Component({
    selector: 'app-auth-shell',
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
    imports: [MaterialModule, RouterLink, ProfileButtonComponent, ProfileButtonComponent]
})
export class ShellComponent {
    private _breakpointObserver = inject(BreakpointObserver);

    links: Link[] = [
        { label: 'Featured Posts', path: 'featured' },
        { label: 'Give feedback', path: 'feedback' }
    ];

    isHandset = toSignal(
        this._breakpointObserver
            .observe(Breakpoints.Handset)
            .pipe(map((result) => result.matches))
    );
}
