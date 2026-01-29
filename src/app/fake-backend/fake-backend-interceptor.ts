import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { defer, delay, of, throwError } from 'rxjs';
import { AuthResult } from '@/pages/auth/model/authResult';
import { AuthRequest } from '@/pages/auth/model/authRequest';
import { Message } from 'api';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';
import { backendFakeData } from '@/fake-backend/backend-fake-data';

const responseDelay = 1000;
const respond = <T>(value: HttpResponse<T>) => defer(() => of(value).pipe(delay(responseDelay)));
const respondError = (err: Error) => defer(() => throwError(() => err).pipe(delay(responseDelay)));

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

function isAuthRequest(pet: unknown): pet is AuthRequest {
    return <AuthRequest>(<unknown>pet) !== undefined;
}

const PUTRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method === 'PUT' && isAuthRequest(req.body)) {
        return next(req);
    }
    return next(req);
};

const POSTRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'POST') {
        return next(req);
    }

    if (isAuthRequest(req.body)) {
        switch (req.url) {
            case 'http://localhost:9000/api/login':
                if (req.body.email === 'christian.minatti@gmail.com' && !!req.body.password) {
                    return respond(new HttpResponse<AuthResult>({ status: 200, body: { idToken: 'ABCDEF', expiresIn: 28800 } })); // 28800 = 8h
                }
                return respondError(
                    new Error('Invalid credentials', {
                        cause: {
                            status: 401,
                            statusText: 'Unauthorized'
                        }
                    })
                );
            case 'http://localhost:9000/api/logout':
                return respond(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
        }
    }

    if (req.url.endsWith('/api/messages/send')) {
        const nextId = uuidv4();
        const newMessage: Message = {
            auditUuid: nextId,
            subject: (req.body as Message).subject,
            body: (req.body as Message).body,
            recipientName: (req.body as Message).recipientName,
            senderAddress: 'you@comino.app',
            messageDate: new Date().toISOString(),
            attachments: (req.body as Message).attachments ?? []
        };
        backendFakeData.sentMessages = [newMessage, ...backendFakeData.sentMessages];
        const draftId = (req.body as { auditUuid?: string }).auditUuid;
        if (draftId) {
            backendFakeData.draftMessages = backendFakeData.draftMessages.filter((draft) => draft.auditUuid !== draftId);
        }
        return respond(new HttpResponse({ status: 200, body: newMessage }));
    }

    return next(req);
};

const GETRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET') {
        return next(req);
    }

    if (req.url.includes('/api/messages/inbox')) {
        return respond(new HttpResponse({ status: 200, body: paginate(req, backendFakeData.inboxMessages) }));
    }

    if (req.url.includes('/api/messages/sent')) {
        return respond(new HttpResponse({ status: 200, body: paginate(req, backendFakeData.sentMessages) }));
    }

    if (req.url.includes('/api/messages/drafts')) {
        return respond(new HttpResponse({ status: 200, body: paginate(req, backendFakeData.draftMessages) }));
    }

    if (isAuthRequest(req.body)) {
        return next(req);
    }

    return next(req);
};

function paginate(req: HttpRequest<unknown>, data: Message[]) {
    const offset = Number(req.params.get('offset') ?? 0);
    const limit = Number(req.params.get('limit') ?? data.length);
    return data.slice(offset, offset + limit);
}

function getAudtiUUID(req: HttpRequest<unknown>) {
    let candidate = req.url.split('/').pop();
    if (isValidUUID(candidate)) {
        return candidate;
    }
    return respondError(new Error('Invalid UUID provided'));
}

const DELETERequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'DELETE') {
        return next(req);
    }

    if (req.url.includes('/api/messages/inbox/')) {
        const auditUuid = getAudtiUUID(req);
        backendFakeData.inboxMessages = backendFakeData.inboxMessages.filter((message) => message.auditUuid !== auditUuid);
        return respond(new HttpResponse({ status: 200 }));
    }

    if (req.url.includes('/api/messages/sent/')) {
        const auditUuid = getAudtiUUID(req);
        backendFakeData.sentMessages = backendFakeData.sentMessages.filter((message) => message.auditUuid !== auditUuid);
        return respond(new HttpResponse({ status: 200 }));
    }

    if (isAuthRequest(req.body) && req.url === 'http://localhost:9000/api/logout') {
        return respond(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
    }

    return next(req);
};
