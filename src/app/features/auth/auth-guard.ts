import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthService } from '@/features/auth/auth-service';
import { inject } from '@angular/core';
import { LoggerService } from '@/core/services/logger/logger';

export const authGuard: CanActivateFn = (_route, _state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const logger = inject(LoggerService);
    void _route;
    void _state;
    if (!auth.isLoggedIn()) {
        logger.debug('User is not logged in, redirecting to login page');
        return router.parseUrl('/auth/login');
    }
    logger.debug('User is redirected to login page');
    return true;
};

// Used with canMatch to avoid loading protected routes when unauthenticated.
export const authMatchGuard: CanMatchFn = (_route, segments) => {
    const auth = inject(AuthService);
    if (auth.isLoggedIn()) {
        return true;
    }
    if (segments.length === 0) {
        const router = inject(Router);
        return router.parseUrl('/auth/login');
    }
    return false;
};
