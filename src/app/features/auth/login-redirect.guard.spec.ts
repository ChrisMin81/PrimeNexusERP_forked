import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth-service';
import { createSpyObj, type SpyObj } from '@/testing/spy';
import { loginRedirectGuard } from './login-redirect.guard';

describe('loginRedirectGuard', () => {
    const executeGuard: CanActivateFn = (...params) =>
        TestBed.runInInjectionContext(() => loginRedirectGuard(...params));

    let authService: SpyObj<AuthService>;
    let router: SpyObj<Router>;

    beforeEach(() => {
        authService = createSpyObj<AuthService>(['isLoggedIn']);
        router = createSpyObj<Router>(['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router }
            ]
        });
    });

    it('blocks access and redirects to dashboard when already authenticated', () => {
        authService.isLoggedIn.mockReturnValue(true);

        const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/', 'dashboard']);
    });

    it('allows access to login when not authenticated', () => {
        authService.isLoggedIn.mockReturnValue(false);

        const result = executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
    });
});

