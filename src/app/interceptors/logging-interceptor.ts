import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { isDevMode } from '@angular/core';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
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
                    console.log('Response Status:', event.status);
                } else {
                    if (event.type === HttpEventType.Sent) {
                        console.log('Request Type: ', event.type, req.body);
                    }
                }
            })
        );
    }
    return interceptedRequest$;
};
