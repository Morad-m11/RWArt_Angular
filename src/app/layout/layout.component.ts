import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MaterialModule } from '../material.module';
import { RouterLink } from '@angular/router';

interface Link {
  name: string;
  url: string;
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
    { name: 'Posts', url: 'posts' },
    { name: 'Give feedback', url: 'feedback' },
  ];

  isHandset = toSignal(
    this._breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map((result) => result.matches)),
    {}
  );
}
