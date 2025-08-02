import {
    ApplicationConfig,
    ErrorHandler,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideMaterialDefaults } from './core/config/material';
import { GlobalErrorHandler } from './core/error-handler';
import { apiBaseUrlInterceptor } from './core/interceptors/api-base-url/api-base-url.interceptor';
import { authInterceptor } from './core/interceptors/auth/auth-interceptor';
import { serverErrorInterceptor } from './core/interceptors/server-error/server-error.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideHttpClient(
            withInterceptors([
                apiBaseUrlInterceptor,
                serverErrorInterceptor,
                authInterceptor
            ])
        ),
        provideRouter(routes, withComponentInputBinding()),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        provideMaterialDefaults()
    ]
};
