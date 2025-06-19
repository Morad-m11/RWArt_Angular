import { httpResource } from '@angular/common/http';
import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';
import { TitleCasePipe } from '@angular/common';

interface Profile {
   sub: 1;
   username: 'john';
   iat: 1750331142;
   exp: 1750332042;
}

@Component({
   selector: 'app-profile',
   standalone: true,
   imports: [MaterialModule, TitleCasePipe],
   templateUrl: './profile.component.html',
   styleUrl: './profile.component.scss'
})
export class ProfileComponent {
   profile = httpResource<Profile>(() => 'http://localhost:3000/user/profile');
}
