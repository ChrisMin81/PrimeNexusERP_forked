import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { AuthResult } from '@/pages/auth/model/authResult';
import { AuthRequest } from '@/pages/auth/model/authRequest';
import { Message } from '@/pages/messages/models/message';

let inboxMessages: Message[] = [
    {
        id: 1,
        subject: 'Welcome to Comino',
        content: 'Thanks for joining. Here are a few tips to get started with your workspace.',
        sender: 'Comino Team',
        recipients: ['you@comino.app'],
        timestamp: new Date('2026-01-23T08:30:00Z'),
        attachments: [],
        isRead: false
    },
    {
        id: 2,
        subject: 'Weekly status report',
        content: 'Your weekly report is ready. Review project health, blockers, and recent activity.',
        sender: 'Automations',
        recipients: ['you@comino.app'],
        timestamp: new Date('2026-01-22T14:12:00Z'),
        attachments: [{ id: 1, name: 'status-report.pdf', size: 1024, type: 'application/pdf' }],
        isRead: false
    },
    {
        id: 3,
        subject: 'Design review feedback',
        content: 'Nice progress on the inbox UX. A few notes on spacing and empty states are attached.',
        sender: 'Elena Roberts',
        recipients: ['you@comino.app'],
        timestamp: new Date('2026-01-21T18:45:00Z'),
        attachments: [{ id: 2, name: 'feedback.txt', size: 123, type: 'text/plain' }],
        isRead: true
    },
    {
        id: 4,
        subject: 'Client kickoff notes',
        content: 'Great meeting today. Sharing the summary and next steps for the kickoff.',
        sender: 'Project Ops',
        recipients: ['you@comino.app'],
        timestamp: new Date('2026-01-21T09:05:00Z'),
        attachments: [],
        isRead: true
    }
];

let sentMessages: Message[] = [
    {
        id: 101,
        subject: 'Re: Design review feedback',
        content: 'Thanks! I will incorporate the spacing changes and send an updated mock later today.',
        sender: 'you@comino.app',
        recipients: ['elena@studio.example'],
        timestamp: new Date('2026-01-21T19:12:00Z'),
        attachments: [],
        isRead: true
    },
    {
        id: 102,
        subject: 'Kickoff follow-up',
        content: 'Attached are the draft milestones and the proposed delivery timeline for review.',
        sender: 'you@comino.app',
        recipients: ['project.ops@example.com', 'lead@example.com'],
        timestamp: new Date('2026-01-21T10:30:00Z'),
        attachments: [{ id: 10, name: 'milestones.xlsx', size: 1024, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }],
        isRead: true
    },
    {
        id: 103,
        subject: 'Workspace access',
        content: 'Can you grant access to the new workspace for the onboarding run?',
        sender: 'you@comino.app',
        recipients: ['admin@example.com'],
        timestamp: new Date('2026-01-20T16:05:00Z'),
        attachments: [],
        isRead: true
    }
];

let draftMessages: Message[] = [
    {
        id: 201,
        subject: 'Product launch outline',
        content: 'Drafting the outline for the launch announcement. Add metrics and CTA links.',
        sender: 'you@comino.app',
        recipients: ['marketing@example.com'],
        timestamp: new Date('2026-01-22T12:15:00Z'),
        attachments: [],
        isRead: true
    },
    {
        id: 202,
        subject: 'Onboarding checklist',
        content: 'Checklist draft: accounts, environments, permissions, intro calls. Please review.',
        sender: 'you@comino.app',
        recipients: ['ops@example.com'],
        timestamp: new Date('2026-01-21T08:50:00Z'),
        attachments: [],
        isRead: true
    }
];

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
                    return of(new HttpResponse<AuthResult>({ status: 200, body: { idToken: 'ABCDEF', expiresIn: 28800 } })); // 28800 = 8h
                }
                return throwError(
                    () =>
                        new Error('Invalid credentials', {
                            cause: {
                                status: 401,
                                statusText: 'Unauthorized'
                            }
                        })
                );
            case 'http://localhost:9000/api/logout':
                return of(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
        }
    }

    if (req.url.endsWith('/api/messages/send')) {
        const nextId = Math.max(...sentMessages.map((m) => m.id), 100) + 1;
        const newMessage: Message = {
            id: nextId,
            subject: (req.body as Message).subject,
            content: (req.body as Message).content,
            recipients: (req.body as Message).recipients,
            sender: 'you@comino.app',
            timestamp: new Date(),
            attachments: (req.body as Message).attachments ?? [],
            isRead: true
        };
        sentMessages = [newMessage, ...sentMessages];
        const draftId = (req.body as { draftId?: number }).draftId;
        if (draftId) {
            draftMessages = draftMessages.filter((draft) => draft.id !== draftId);
        }
        return of(new HttpResponse({ status: 200, body: newMessage }));
    }

    return next(req);
};

const GETRequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'GET') {
        return next(req);
    }

    if (req.url.includes('/api/messages/inbox')) {
        return of(new HttpResponse({ status: 200, body: paginate(req, inboxMessages) }));
    }

    if (req.url.includes('/api/messages/sent')) {
        return of(new HttpResponse({ status: 200, body: paginate(req, sentMessages) }));
    }

    if (req.url.includes('/api/messages/drafts')) {
        return of(new HttpResponse({ status: 200, body: paginate(req, draftMessages) }));
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

const DELETERequestHandler: HttpInterceptorFn = (req, next) => {
    if (req.method !== 'DELETE') {
        return next(req);
    }

    if (req.url.includes('/api/messages/inbox/')) {
        const id = Number(req.url.split('/').pop());
        inboxMessages = inboxMessages.filter((message) => message.id !== id);
        return of(new HttpResponse({ status: 200 }));
    }

    if (req.url.includes('/api/messages/sent/')) {
        const id = Number(req.url.split('/').pop());
        sentMessages = sentMessages.filter((message) => message.id !== id);
        return of(new HttpResponse({ status: 200 }));
    }

    if (isAuthRequest(req.body) && req.url === 'http://localhost:9000/api/logout') {
        return of(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
    }

    return next(req);
};
