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

        expect(service.loading()).toBeFalse();

        const sub = service.showLoaderUntilCompleted(source$).subscribe((value) => values.push(value));

        expect(service.loading()).toBeTrue();

        source$.next(1);
        source$.complete();

        expect(values).toEqual([1]);
        expect(service.loading()).toBeFalse();

        sub.unsubscribe();
    });

    it('clears loading when the source errors', (done) => {
        const source$ = new Subject<number>();

        service.showLoaderUntilCompleted(source$).subscribe({
            error: (err) => {
                expect(err).toEqual(new Error('boom'));
                setTimeout(() => {
                    expect(service.loading()).toBeFalse();
                    done();
                }, 0);
            }
        });

        expect(service.loading()).toBeTrue();
        source$.error(new Error('boom'));
    });
});
