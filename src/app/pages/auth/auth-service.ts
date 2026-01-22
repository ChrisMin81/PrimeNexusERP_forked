import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay, tap } from 'rxjs';
import { AuthResult } from '@/pages/auth/model/authResult';
import { addSeconds, subSeconds, isBefore } from 'date-fns';
import { log } from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

/**
 * Service responsible for handling user authentication and session management.
 */
@Injectable()
export class AuthService {
    private http: HttpClient = inject(HttpClient);

    login(email: string, password: string) {
        return this.http.post<AuthResult>('http://localhost:9000/api/login', { email, password }).pipe(
            tap((res) => this.setSession(res)),
            shareReplay(1)
        );
    }

    private setSession(authResult: AuthResult) {
        const now = new Date();
        const expiresAt = addSeconds(now, 45);
        console.log('Setting session with token:', authResult);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        return this.http.delete('http://localhost:9000/api/logout').pipe(
            shareReplay(1)
        );
    }

    public isLoggedIn() {
        return isBefore(new Date(), this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const exp = localStorage.getItem('expires_at');
        return exp !== null ? new Date(exp) : subSeconds(new Date(), 1);
    }
}
