import { inject, Injectable, Injector, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, shareReplay, tap, throwError } from 'rxjs';
import { AuthResult } from '@/pages/auth/model/authResult';
import { addSeconds, isBefore, subSeconds } from 'date-fns';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoggerService } from '@/services/logger/logger';

/**
 * Service responsible for handling user authentication and session management.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
    private http: HttpClient = inject(HttpClient);
    private router: Router = inject(Router);
    private injector = inject(Injector);
    private logger = inject(LoggerService);

    login(email: string, password: string): Signal<AuthResult | undefined> {
        return toSignal(
            this.http.post<AuthResult>('http://localhost:9000/api/login', { email, password }).pipe(
                catchError((err) => {
                    this.cleanupStorageEntries();
                    this.router.navigate(['/auth/unauthorized-access']);
                    return throwError(() => err);
                }),
                tap((res) => this.setSession(res)),
                tap(() => this.router.navigate(['/', 'dashboard'])),
                shareReplay(1)
            ),
            { injector: this.injector }
        );
    }

    private setSession(authResult: AuthResult) {
        this.logger.trace('Setting session with token:', authResult);

        const now = new Date();
        const expiresAt = addSeconds(now, authResult.expiresIn ?? -1);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    logout() {
        this.cleanupStorageEntries();
        return toSignal(
            this.http.delete('http://localhost:9000/api/logout').pipe(
                shareReplay(1),
                tap(() => this.router.navigate(['/auth/login']))
            ),
            { injector: this.injector }
        );
    }

    private cleanupStorageEntries() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    public isLoggedIn() {
        return isBefore(new Date(), this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const exp = localStorage.getItem('expires_at');
        if (exp === null) {
            return subSeconds(new Date(), 1);
        }
        const expMillis = JSON.parse(exp);
        const date = new Date(expMillis);
        this.logger.debug('exp:', exp);
        this.logger.debug('Expiration:', date.toString());
        return date;
    }

    isAuthenticated() {
        return this.isLoggedIn();
    }
}
