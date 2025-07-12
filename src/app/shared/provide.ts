import { Provider, Type } from '@angular/core';

export function provideValue<T>(token: Type<T>, mock: Partial<T> = {}): Provider {
   return { provide: token, useValue: mock };
}
