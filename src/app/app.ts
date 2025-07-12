import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellComponent } from './core/shell/shell.component';
import { MaterialModule } from './shared/material.module';

@Component({
    selector: 'app-root',
    imports: [MaterialModule, ShellComponent, RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {}
