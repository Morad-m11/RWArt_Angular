import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { IconTextComponent } from 'src/app/shared/components/icon-text/icon-text.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { TypingDirective } from 'src/app/typing.directive';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrl: './shell.component.scss',
    imports: [
        MaterialModule,
        RouterLink,
        IconTextComponent,
        OverlayModule,
        MatInputModule,
        TypingDirective
    ]
})
export class ShellComponent {
    private readonly _breakpointObserver = inject(BreakpointObserver);

    isHandset = toSignal(
        this._breakpointObserver
            .observe(Breakpoints.XSmall)
            .pipe(map((result) => result.matches))
    );

    isOpen = false;
}
