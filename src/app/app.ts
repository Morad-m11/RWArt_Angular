import { Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { from, interval, map, startWith, takeWhile } from 'rxjs';
import { AuthService } from './core/services/auth/auth.service';
import { ShellComponent } from './core/shell/shell.component';
import { MaterialModule } from './shared/material.module';
import { RAIN_WORLD } from './shared/rainworld';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ShellComponent, MaterialModule],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private readonly _iconRegistry = inject(MatIconRegistry);
    private readonly _sanitizer = inject(DomSanitizer);

    private readonly _auth = inject(AuthService);

    serverReady = toSignal(from(this._auth.waitForAuth()).pipe(map(() => true)));
    progress: Signal<number>;

    constructor() {
        const start = performance.now();

        this.progress = toSignal(
            interval(100).pipe(
                map(() => (performance.now() - start) / 1000),
                startWith(0),
                takeWhile((time) => time < 60)
            ),
            { requireSync: true }
        );

        this._addCustomSvgIcons();
    }

    private _addCustomSvgIcons() {
        const icons = Object.values(RAIN_WORLD)
            .flat()
            .map((x) => x.icon);

        icons.forEach((name) => {
            this._iconRegistry.addSvgIcon(
                name,
                this._sanitizer.bypassSecurityTrustResourceUrl(`assets/${name}.svg`)
            );
        });
    }
}
