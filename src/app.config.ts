import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { authInterceptorFn } from '@/interceptors/auth.interceptor';
import { authErrorInterceptorFn } from '@/interceptors/auth-error.interceptor';
import { loggingInterceptor } from '@/interceptors/logging-interceptor';
import { fakeBackendInterceptor } from '@/fake-backend/fake-backend-interceptor';
import { LoadingService } from '@/services/loading/loading.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation(), withViewTransitions()),
        provideHttpClient(withInterceptors([fakeBackendInterceptor, authInterceptorFn, authErrorInterceptorFn, loggingInterceptor]), withFetch()),
        provideZonelessChangeDetection(),
        providePrimeNG({
            ripple: true,
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        }),
        LoadingService
    ]
};
