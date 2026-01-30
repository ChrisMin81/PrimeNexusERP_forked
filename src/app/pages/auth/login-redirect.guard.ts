import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { inject } from '@angular/core';

/**
 * Prevents authenticated users from visiting the login page and sends them to the dashboard instead.
 */
export const loginRedirectGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isLoggedIn()) {
        router.navigate(['/', 'dashboard']);
        return false;
    }

    return true;
};
