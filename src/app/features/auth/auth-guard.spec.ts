import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from './auth-service';
import { LoggerService } from '@/core/services/logger/logger';
import { createSpyObj, type SpyObj } from '@/testing/spy';

import { authGuard, authMatchGuard } from './auth-guard';

describe('authGuard', () => {
    const executeCanActivate: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters));
    const executeCanMatch: CanMatchFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authMatchGuard(...guardParameters));

    let authService: SpyObj<AuthService>;
    let router: SpyObj<Router>;
    let logger: SpyObj<LoggerService>;

    beforeEach(() => {
        authService = createSpyObj<AuthService>(['isLoggedIn']);
        router = createSpyObj<Router>(['navigate', 'parseUrl']);
        logger = createSpyObj<LoggerService>(['debug']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: LoggerService, useValue: logger }
            ]
        });
    });

    it('redirects to login when user is not logged in (canActivate)', () => {
        authService.isLoggedIn.mockReturnValue(false);
        const urlTree = {} as UrlTree;
        router.parseUrl.mockReturnValue(urlTree);

        const result = executeCanActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

        expect(result).toBe(urlTree);
        expect(router.parseUrl).toHaveBeenCalledOnce();
        expect(router.parseUrl).toHaveBeenCalledWith('/auth/login');
        expect(logger.debug).toHaveBeenCalledWith('User is not logged in, redirecting to login page');
    });

    it('redirects to login when user is not logged in (canMatch)', () => {
        authService.isLoggedIn.mockReturnValue(false);
        const urlTree = {} as UrlTree;
        router.parseUrl.mockReturnValue(urlTree);

        const matchResult = executeCanMatch({} as Route, [] as UrlSegment[]);

        expect(matchResult).toBe(urlTree);
        expect(router.parseUrl).toHaveBeenCalledOnce();
        expect(router.parseUrl).toHaveBeenCalledWith('/auth/login');
    });

    it('allows navigation when user is logged in (canActivate)', () => {
        authService.isLoggedIn.mockReturnValue(true);

        const result = executeCanActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalledWith('User is redirected to login page');
    });

    it('allows navigation when user is logged in (canMatch)', () => {
        authService.isLoggedIn.mockReturnValue(true);

        const matchResult = executeCanMatch({} as Route, [] as UrlSegment[]);

        expect(matchResult).toBe(true);
        expect(router.parseUrl).not.toHaveBeenCalled();
    });

    it('blocks non-root routes when user is not logged in (canMatch)', () => {
        authService.isLoggedIn.mockReturnValue(false);

        const matchResult = executeCanMatch({} as Route, [{ path: 'pages' }] as UrlSegment[]);

        expect(matchResult).toBe(false);
        expect(router.parseUrl).not.toHaveBeenCalled();
    });
});
