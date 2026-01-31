import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
    let service: LoadingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoadingService);
    });

    it('toggles loading while the source observable is active', () => {
        const source$ = new Subject<number>();
        const values: number[] = [];

        expect(service.loading()).toBe(false);

        const sub = service.showLoaderUntilCompleted(source$).subscribe((value) => values.push(value));

        expect(service.loading()).toBe(true);

        source$.next(1);
        source$.complete();

        expect(values).toEqual([1]);
        expect(service.loading()).toBe(false);

        sub.unsubscribe();
    });

    it('clears loading when the source errors', async () => {
        const source$ = new Subject<number>();
        const errorDone = new Promise<void>((resolve) => {
            service.showLoaderUntilCompleted(source$).subscribe({
                error: (err) => {
                    expect(err).toEqual(new Error('boom'));
                    setTimeout(() => {
                        expect(service.loading()).toBe(false);
                        resolve();
                    }, 0);
                }
            });
        });

        expect(service.loading()).toBe(true);
        source$.error(new Error('boom'));
        await errorDone;
    });
});
