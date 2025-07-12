import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileButtonComponent } from './profile-button.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ProfileButtonComponent', () => {
   let component: ProfileButtonComponent;
   let fixture: ComponentFixture<ProfileButtonComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [ProfileButtonComponent],
         providers: [provideHttpClient(), provideHttpClientTesting()]
      }).compileComponents();

      fixture = TestBed.createComponent(ProfileButtonComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});
