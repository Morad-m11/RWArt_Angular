import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './core/shell/shell.component';
import { MaterialModule } from './shared/material.module';

export const RAIN_WORLD = {
    Slugcats: [
        { name: 'Survivor', icon: 'survivor' },
        { name: 'Monk', icon: 'monk' },
        { name: 'Hunter', icon: 'hunter' },
        { name: 'Gourmand', icon: 'gourmand' },
        { name: 'Spearmaster', icon: 'spearmaster' },
        { name: 'Artificer', icon: 'artificer' },
        { name: 'Rivulet', icon: 'rivulet' },
        { name: 'Saint', icon: 'saint' }
    ],
    Iterators: [
        { name: 'Looks to the moon', icon: 'moon' },
        { name: 'Five Pebbles', icon: 'pebbles' }
    ],
    Creatures: [{ name: 'Pink Lizard', icon: 'pink-lizard' }]
};

@Component({
    selector: 'app-root',
    imports: [MaterialModule, ShellComponent, RouterOutlet],
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
