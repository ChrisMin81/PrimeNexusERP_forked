import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { loginRedirectGuard } from './login-redirect.guard';

describe('loginRedirectGuard', () => {
    const executeGuard: CanActivateFn = (...params) =>
        TestBed.runInInjectionContext(() => loginRedirectGuard(...params));

    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router }
            ]
        });
    });

    it('blocks access and redirects to dashboard when already authenticated', () => {
        authService.isLoggedIn.and.returnValue(true);

        const result = executeGuard({} as any, {} as any);

        expect(result).toBeFalse();
        expect(router.navigate).toHaveBeenCalledWith(['/', 'dashboard']);
    });

    it('allows access to login when not authenticated', () => {
        authService.isLoggedIn.and.returnValue(false);

        const result = executeGuard({} as any, {} as any);

        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
    });
});

