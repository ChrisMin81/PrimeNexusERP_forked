import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@/features/auth/auth-service';
import { inject } from '@angular/core';
import { LoggerService } from '@/core/services/logger/logger';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const logger = inject(LoggerService);
    if (!auth.isLoggedIn()) {
        logger.debug('User is not logged in, redirecting to login page');
        router.navigate(['/', 'auth', 'login']);
        return false;
    }
    logger.debug('User is redirected to login page');
    return true;
};

// Used with canMatch to avoid loading protected routes when unauthenticated.
export const authMatchGuard: CanMatchFn = () => authGuard({} as any, { url: '' } as any);
