import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { MaterialModule } from './material.module';

@Component({
   selector: 'app-root',
   imports: [MaterialModule, LayoutComponent, RouterOutlet],
   templateUrl: './app.html',
   styleUrl: './app.scss'
})
export class App {}
