import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
   let fixture: ComponentFixture<App>;
   let app: App;

   beforeEach(async () => {
      await TestBed.configureTestingModule({
         imports: [App],
         providers: [provideZonelessChangeDetection(), provideRouter([])]
      }).compileComponents();

      fixture = TestBed.createComponent(App);
      app = fixture.componentInstance;
      fixture.detectChanges();
   });

   it('should create the app', () => {
      expect(app).toBeTruthy();
   });
});
