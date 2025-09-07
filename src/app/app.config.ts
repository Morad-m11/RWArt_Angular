import { provideCloudinaryLoader } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    ApplicationConfig,
    ErrorHandler,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { CLOUDINARY_CLIENT_ID } from './constants';
import { provideMaterialDefaults } from './core/config/material';
import { GlobalErrorHandler } from './core/error-handler';
import { apiBaseUrlInterceptor } from './core/interceptors/api-base-url/api-base-url.interceptor';
import { authInterceptor } from './core/interceptors/auth/auth-interceptor';
import { serverErrorInterceptor } from './core/interceptors/server-error/server-error.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideRouter(routes, withComponentInputBinding()),
        provideHttpClient(
            withInterceptors([
                apiBaseUrlInterceptor,
                serverErrorInterceptor,
                authInterceptor
            ])
        ),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        provideMaterialDefaults(),
        provideCloudinaryLoader(`https://res.cloudinary.com/${CLOUDINARY_CLIENT_ID}`)
    ]
};
