import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from './auth-service';
import { LoggerService } from '@/core/services/logger/logger';

import { authGuard, authMatchGuard } from './auth-guard';

describe('authGuard', () => {
    const executeCanActivate: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authGuard(...guardParameters));
    const executeCanMatch: CanMatchFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() => authMatchGuard(...guardParameters));

    let authService: jasmine.SpyObj<AuthService>;
    let router: jasmine.SpyObj<Router>;
    let logger: jasmine.SpyObj<LoggerService>;

    beforeEach(() => {
        authService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate', 'parseUrl']);
        logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['debug']);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthService, useValue: authService },
                { provide: Router, useValue: router },
                { provide: LoggerService, useValue: logger }
            ]
        });
    });

    it('redirects to login when user is not logged in (canActivate)', () => {
        authService.isLoggedIn.and.returnValue(false);
        const urlTree = {} as UrlTree;
        router.parseUrl.and.returnValue(urlTree);

        const result = executeCanActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

        expect(result).toBe(urlTree);
        expect(router.parseUrl).toHaveBeenCalledOnceWith('/auth/login');
        expect(logger.debug).toHaveBeenCalledWith('User is not logged in, redirecting to login page');
    });

    it('redirects to login when user is not logged in (canMatch)', () => {
        authService.isLoggedIn.and.returnValue(false);
        const urlTree = {} as UrlTree;
        router.parseUrl.and.returnValue(urlTree);

        const matchResult = executeCanMatch({} as Route, [] as UrlSegment[]);

        expect(matchResult).toBe(urlTree);
        expect(router.parseUrl).toHaveBeenCalledOnceWith('/auth/login');
    });

    it('allows navigation when user is logged in (canActivate)', () => {
        authService.isLoggedIn.and.returnValue(true);

        const result = executeCanActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

        expect(result).toBeTrue();
        expect(router.navigate).not.toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalledWith('User is redirected to login page');
    });

    it('allows navigation when user is logged in (canMatch)', () => {
        authService.isLoggedIn.and.returnValue(true);

        const matchResult = executeCanMatch({} as Route, [] as UrlSegment[]);

        expect(matchResult).toBeTrue();
        expect(router.parseUrl).not.toHaveBeenCalled();
    });

    it('blocks non-root routes when user is not logged in (canMatch)', () => {
        authService.isLoggedIn.and.returnValue(false);

        const matchResult = executeCanMatch({} as Route, [{ path: 'pages' }] as UrlSegment[]);

        expect(matchResult).toBeFalse();
        expect(router.parseUrl).not.toHaveBeenCalled();
    });
});
