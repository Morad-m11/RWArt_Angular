import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MaterialModule } from '../material.module';
import { provideRouter } from '@angular/router';

describe('LayoutComponent', () => {
   let component: LayoutComponent;
   let fixture: ComponentFixture<LayoutComponent>;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [MaterialModule],
         providers: [provideRouter([])]
      }).compileComponents();

      fixture = TestBed.createComponent(LayoutComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should compile', () => {
      expect(component).toBeTruthy();
   });
});
