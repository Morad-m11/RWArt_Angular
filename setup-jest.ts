import { ErrorHandler, NgModule, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

@NgModule({
  providers: [
    provideZonelessChangeDetection(),
    {
      provide: ErrorHandler,
      useValue: {
        handleError: (e: Error) => {
          throw e;
        },
      },
    },
  ],
})
export class TestModule {}

/*
 * Common setup / initialization for all unit tests in Angular Material and CDK.
 */
TestBed.initTestEnvironment([BrowserTestingModule, TestModule], platformBrowserTesting());
