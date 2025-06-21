import { Component } from '@angular/core';
import { MaterialModule } from './material.module';
import { LayoutComponent } from './layout/layout.component';
import { RouterOutlet } from '@angular/router';

@Component({
   selector: 'app-root',
   imports: [MaterialModule, LayoutComponent, RouterOutlet],
   templateUrl: './app.html',
   styleUrl: './app.scss'
})
export class App {}
