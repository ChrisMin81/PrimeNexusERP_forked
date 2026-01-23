import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { inject, isDevMode } from '@angular/core';
import { LoggerService } from '@/services/logger/logger';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LoggerService);
    const interceptedRequest$ = next(req).pipe(
        catchError((err) => {
            console.error('Error:', err);
            return throwError(() => err);
        })
    );
    if (isDevMode()) {
        return interceptedRequest$.pipe(
            tap((event) => {
                if (event.type === HttpEventType.Response) {
                    logger.debug('Response Status:', event.status);
                } else {
                    if (event.type === HttpEventType.Sent) {
                        logger.debug('Request Type: ', event.type, req.body);
                    }
                }
            })
        );
    }
    return interceptedRequest$;
};
