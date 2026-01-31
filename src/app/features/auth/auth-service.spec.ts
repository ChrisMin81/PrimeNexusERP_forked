import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { addSeconds, subSeconds } from 'date-fns';

import { vi } from 'vitest';
import { AuthService } from './auth-service';
import { LoggerService } from '@/core/services/logger/logger';
import { createSpyObj, type SpyObj } from '@/testing/spy';

describe('AuthService', () => {
    let service: AuthService;
    let httpClient: SpyObj<HttpClient>;
    let router: SpyObj<Router>;
    let logger: SpyObj<LoggerService>;

    const loginResponse = {
        idToken: 'token-123',
        expiresIn: 120
    };

    beforeEach(() => {
        httpClient = createSpyObj<HttpClient>(['post', 'delete']);
        router = createSpyObj<Router>(['navigate']);
        router.navigate.mockResolvedValue(true);
        logger = createSpyObj<LoggerService>(['trace', 'debug', 'log', 'info', 'warn', 'error']);

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
        httpClient.post.mockReturnValue(of(loginResponse));

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
        httpClient.post.mockReturnValue(throwError(() => new Error('boom')));
        localStorage.setItem('id_token', 'stale');
        localStorage.setItem('expires_at', '123');

        const resultSignal = service.login('user@test.com', 'pw');

        expect(() => resultSignal()).toThrowError('boom');
        expect(localStorage.getItem('id_token')).toBeNull();
        expect(localStorage.getItem('expires_at')).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/auth/unauthorized-access']);
    });

    it('logs out, clears storage and redirects to login', () => {
        httpClient.delete.mockReturnValue(of({}));
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

        expect(service.isLoggedIn()).toBe(true);
        expect(service.isLoggedOut()).toBe(false);
    });

    it('isLoggedIn returns false when expiration is in the past', () => {
        const past = subSeconds(new Date(), 60).valueOf();
        localStorage.setItem('expires_at', JSON.stringify(past));

        expect(service.isLoggedIn()).toBe(false);
        expect(service.isLoggedOut()).toBe(true);
    });

    it('isAuthenticated proxies isLoggedIn', () => {
        vi.spyOn(service, 'isLoggedIn').mockReturnValue(true);
        expect(service.isAuthenticated()).toBe(true);
        expect(service.isLoggedIn).toHaveBeenCalled();
    });
});
