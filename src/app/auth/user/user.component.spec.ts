import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import { AuthService } from '../auth.service';
import { Provider, Type } from '@angular/core';

describe('UserComponent', () => {
   let component: UserComponent;
   let fixture: ComponentFixture<UserComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [UserComponent],
         providers: [mockProvider(AuthService)],
      }).compileComponents();

      fixture = TestBed.createComponent(UserComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create', () => {
      expect(component).toBeTruthy();
   });
});

function mockProvider<T>(instance: Type<T>, mock: Partial<T> = {}): Provider {
   return { provide: instance, useValue: mock };
}
