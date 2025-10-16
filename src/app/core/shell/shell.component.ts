import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { ProfileButtonComponent } from 'src/app/shared/components/profile-button/profile-button.component';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
    imports: [
        MaterialModule,
        RouterLink,
        ProfileButtonComponent,
        ProfileButtonComponent,
        IconTextComponent
    ]
})
export class ShellComponent {
    private readonly _breakpointObserver = inject(BreakpointObserver);

    isHandset = toSignal(
        this._breakpointObserver
            .observe(Breakpoints.Handset)
            .pipe(map((result) => result.matches))
    );
}
