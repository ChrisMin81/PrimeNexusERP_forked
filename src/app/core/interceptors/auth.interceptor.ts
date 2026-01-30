import { HttpInterceptorFn } from '@angular/common/http';

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
export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
        const authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${idToken}`
            }
        });
        return next(authReq);
    } else {
        return next(req);
    }
};
