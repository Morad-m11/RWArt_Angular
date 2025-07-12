import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { ShellComponent } from './shell.component';

describe('ShellComponent', () => {
   let component: ShellComponent;
   let fixture: ComponentFixture<ShellComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [MaterialModule],
         providers: [provideRouter([])]
      }).compileComponents();

      fixture = TestBed.createComponent(ShellComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should compile', () => {
      expect(component).toBeTruthy();
   });
});
