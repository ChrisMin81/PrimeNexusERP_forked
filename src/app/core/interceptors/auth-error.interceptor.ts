import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * An HTTP interceptor function that adds an authorization token to the request header if available.
 *
 * This function retrieves the `id_token` from local storage and, if present, appends it
 * as a Bearer token in the `Authorization` header of the outgoing HTTP request. If no
 * token is found, the request is forwarded without modification.
 *
 * @param req - The original HTTP request object.
 * @param next - The handler function responsible for forwarding the modified or unmodified request.
 * @returns The next HTTP handler's result, either with the modified or unmodified request.
 */
export const authErrorInterceptorFn: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error) => {
            if (error.status === 401) {
                console.error('Unauthorized - redirecting to login');
            }
            return throwError(() => error);
        })
    );
};
