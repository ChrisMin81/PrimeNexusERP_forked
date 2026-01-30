import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { addSeconds, subSeconds } from 'date-fns';

import { AuthService } from './auth-service';
import { LoggerService } from '@/services/logger/logger';

describe('AuthService', () => {
    let service: AuthService;
    let httpClient: jasmine.SpyObj<HttpClient>;
    let router: jasmine.SpyObj<Router>;
    let logger: jasmine.SpyObj<LoggerService>;

    const loginResponse = {
        idToken: 'token-123',
        expiresIn: 120
    };

    beforeEach(() => {
        httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'delete']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.resolveTo(true);
        logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['trace', 'debug', 'log', 'info', 'warn', 'error']);

        TestBed.configureTestingModule({
            providers: [
                AuthService,
                { provide: HttpClient, useValue: httpClient },
                { provide: Router, useValue: router },
                { provide: LoggerService, useValue: logger }
            ]
        });

        service = TestBed.inject(AuthService);
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('logs in successfully, sets session and redirects to dashboard', () => {
        httpClient.post.and.returnValue(of(loginResponse));

        const resultSignal = service.login('user@test.com', 'pw');
        const result = resultSignal();

        expect(httpClient.post).toHaveBeenCalledWith('http://localhost:9000/api/login', {
            username: 'user@test.com',
            password: 'pw'
        });
        expect(result).toEqual(loginResponse);
        expect(localStorage.getItem('id_token')).toBe('token-123');
        expect(localStorage.getItem('expires_at')).toBeTruthy();
        expect(router.navigate).toHaveBeenCalledWith(['/', 'dashboard']);
    });

    it('handles login error by cleaning storage and redirecting to unauthorized', () => {
        httpClient.post.and.returnValue(throwError(() => new Error('boom')));
        localStorage.setItem('id_token', 'stale');
        localStorage.setItem('expires_at', '123');

        const resultSignal = service.login('user@test.com', 'pw');

        expect(() => resultSignal()).toThrowError('boom');
        expect(localStorage.getItem('id_token')).toBeNull();
        expect(localStorage.getItem('expires_at')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/unauthorized-access']);
    });

    it('logs out, clears storage and redirects to login', () => {
        httpClient.delete.and.returnValue(of({}));
        localStorage.setItem('id_token', 'active');
        localStorage.setItem('expires_at', '123');

        const resultSignal = service.logout();
        resultSignal();

        expect(httpClient.delete).toHaveBeenCalledWith('http://localhost:9000/api/logout');
        expect(localStorage.getItem('id_token')).toBeNull();
        expect(localStorage.getItem('expires_at')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('isLoggedIn returns true when expiration is in the future', () => {
        const future = addSeconds(new Date(), 60).valueOf();
        localStorage.setItem('expires_at', JSON.stringify(future));

        expect(service.isLoggedIn()).toBeTrue();
        expect(service.isLoggedOut()).toBeFalse();
    });

    it('isLoggedIn returns false when expiration is in the past', () => {
        const past = subSeconds(new Date(), 60).valueOf();
        localStorage.setItem('expires_at', JSON.stringify(past));

        expect(service.isLoggedIn()).toBeFalse();
        expect(service.isLoggedOut()).toBeTrue();
    });

    it('isAuthenticated proxies isLoggedIn', () => {
        spyOn(service, 'isLoggedIn').and.returnValue(true);
        expect(service.isAuthenticated()).toBeTrue();
        expect(service.isLoggedIn).toHaveBeenCalled();
    });
});
