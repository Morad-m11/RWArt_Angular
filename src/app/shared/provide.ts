import { Provider, ProviderToken } from '@angular/core';

export function provideValue<T>(
    token: ProviderToken<T>,
    mock: Partial<T> = {}
): Provider {
    return { provide: token, useValue: mock };
}
