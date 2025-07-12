import {
    ApplicationConfig,
    ErrorHandler,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldDefaultOptions
} from '@angular/material/form-field';
import { routes } from './app.routes';
import { GlobalErrorHandler } from './core/error-handler';
import { authInterceptor } from './core/interceptors/auth/auth-interceptor';
import { serverErrorInterceptor } from './core/interceptors/server-error/server-error.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([serverErrorInterceptor, authInterceptor])),
        provideRouter(routes),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' } as MatFormFieldDefaultOptions
        }
    ]
};
