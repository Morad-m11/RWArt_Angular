import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MaterialModule } from '../material.module';
import { RouterLink } from '@angular/router';

interface Link {
   label: string;
   path: string;
}

@Component({
   selector: 'app-layout',
   templateUrl: './layout.component.html',
   styleUrl: './layout.component.scss',
   imports: [MaterialModule, RouterLink],
})
export class LayoutComponent {
   private _breakpointObserver = inject(BreakpointObserver);

   links: Link[] = [
      { label: 'Posts', path: 'posts' },
      { label: 'Give feedback', path: 'feedback' },
      { label: 'User', path: 'user' },
   ];

   isHandset = toSignal(
      this._breakpointObserver
         .observe(Breakpoints.Handset)
         .pipe(map((result) => result.matches)),
      {}
   );
}
