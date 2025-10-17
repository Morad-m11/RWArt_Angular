import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './core/shell/shell.component';
import { RAIN_WORLD } from './shared/rainworld';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, ShellComponent],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    private readonly _iconRegistry = inject(MatIconRegistry);
    private readonly _sanitizer = inject(DomSanitizer);

    constructor() {
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
