import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
    readonly loading = signal<boolean>(false);

    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        return of(null).pipe(
            tap(() => this.loadingOn()),
            concatMap(() => obs$),
            finalize(() => this.loadingOff())
        );
    }

    private loadingOn() {
        this.loading.set(true);
    }

    private loadingOff() {
        this.loading.set(false);
    }
}
