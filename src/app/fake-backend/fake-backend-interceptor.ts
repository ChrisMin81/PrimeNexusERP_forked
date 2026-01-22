import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthResult } from '@/pages/auth/model/authResult';

export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
    switch (req.method) {
        case 'GET':
            return GETRequestHandler(req, next);
        case 'POST':
            return POSTRequestHandler(req, next);
        case 'PUT':
            return PUTRequestHandler(req, next);
        case 'DELETE':
            return DELETERequestHandler(req, next);
    }
    return next(req);
};

export const PUTRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method === 'PUT') {
        return next(req);
    }
    return next(req);
};

export const POSTRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method === 'POST') {
        switch (req.url) {
            case 'http://localhost:9000/api/login':
                return of(new HttpResponse<AuthResult>({ status: 200, body: { idToken: 'ABCDEF', expiresIn: 3600 } }));
            case 'http://localhost:9000/api/logout':
                return of(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
        }
    }
    return next(req);
};

export const GETRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method === 'GET') {
        return next(req);
    }
    return next(req);
};

export const DELETERequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method === 'DELETE') {
        switch (req.url) {
            case 'http://localhost:9000/api/logout':
                return of(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
        }
    }
    return next(req);
};
