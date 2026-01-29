import { HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { defer, delay, of, throwError } from 'rxjs';
import { AuthResult } from '@/pages/auth/model/authResult';
import { AuthRequest } from '@/pages/auth/model/authRequest';
import { Message } from '@/api/models/message';
import { v4 as uuidv4, validate as isValidUUID } from 'uuid';

let inboxMessages: Message[] = [
    {
        auditUuid: '1fa06eac-c744-4087-96d1-495e5d8681af',
        subject: 'Welcome to Comino',
        body: 'Thanks for joining. Here are a few tips to get started with your workspace.',
        senderName: 'Comino Team',
        recipientName: 'you@comino.app',
        messageDate: '2026-01-23T08:30:00Z',
        attachments: []
    },
    {
        auditUuid: '23cea578-9673-4f0c-826c-a790d944dd52',
        subject: 'Weekly status report',
        body: 'Your weekly report is ready. Review project health, blockers, and recent activity.',
        senderName: 'Automations',
        recipientName: 'you@comino.app',
        messageDate: '2026-01-22T14:12:00Z',
        attachments: [{ auditUuid: uuidv4(), baseName: 'status-report.pdf', sizeInBytes: 1024, mimeType: 'application/pdf' }]
    },
    {
        auditUuid: '33cea578-9673-4f0c-826c-a790d944dd53',
        subject: 'Design review feedback',
        body: 'Nice progress on the inbox UX. A few notes on spacing and empty states are attached.',
        senderName: 'Elena Roberts',
        recipientName: 'you@comino.app',
        messageDate: '2026-01-21T18:45:00Z',
        attachments: [{ auditUuid: uuidv4(), baseName: 'feedback.txt', sizeInBytes: 123, mimeType: 'text/plain' }]
    },
    {
        auditUuid: '43cea578-9673-4f0c-826c-a890d944dd52',
        subject: 'Client kickoff notes',
        body: 'Great meeting today. Sharing the summary and next steps for the kickoff.',
        senderName: 'Project Ops',
        recipientName: 'you@comino.app',
        messageDate: '2026-01-21T09:05:00Z',
        attachments: []
    }
];

let sentMessages: Message[] = [
    {
        auditUuid: uuidv4(),
        subject: 'Re: Design review feedback',
        body: 'Thanks! I will incorporate the spacing changes and send an updated mock later today.',
        senderAddress: 'you@comino.app',
        recipientName: 'elena@studio.example',
        messageDate: '2026-01-21T19:12:00Z',
        attachments: []
    },
    {
        auditUuid: uuidv4(),
        subject: 'Kickoff follow-up',
        body: 'Attached are the draft milestones and the proposed delivery timeline for review.',
        senderAddress: 'you@comino.app',
        recipientName: 'project.ops@example.com',
        messageDate: '2026-01-21T10:30:00Z',
        attachments: [{ auditUuid: uuidv4(), baseName: 'milestones.xlsx', sizeInBytes: 1024, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }]
    },
    {
        auditUuid: uuidv4(),
        subject: 'Workspace access',
        body: 'Can you grant access to the new workspace for the onboarding run?',
        senderAddress: 'you@comino.app',
        recipientName: 'admin@example.com',
        messageDate: '2026-01-20T16:05:00Z',
        attachments: []
    }
];

let draftMessages: Message[] = [
    {
        auditUuid: uuidv4(),
        subject: 'Product launch outline',
        body: 'Drafting the outline for the launch announcement. Add metrics and CTA links.',
        senderAddress: 'you@comino.app',
        recipientName: 'marketing@example.com',
        messageDate: '2026-01-22T12:15:00Z',
        attachments: []
    },
    {
        auditUuid: uuidv4(),
        subject: 'Onboarding checklist',
        body: 'Checklist draft: accounts, environments, permissions, intro calls. Please review.',
        senderAddress: 'you@comino.app',
        recipientName: 'ops@example.com',
        messageDate: '2026-01-21T08:50:00Z',
        attachments: []
    }
];

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
        sentMessages = [newMessage, ...sentMessages];
        const draftId = (req.body as { auditUuid?: string }).auditUuid;
        if (draftId) {
            draftMessages = draftMessages.filter((draft) => draft.auditUuid !== draftId);
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
        return respond(new HttpResponse({ status: 200, body: paginate(req, inboxMessages) }));
    }

    if (req.url.includes('/api/messages/sent')) {
        return respond(new HttpResponse({ status: 200, body: paginate(req, sentMessages) }));
    }

    if (req.url.includes('/api/messages/drafts')) {
        return respond(new HttpResponse({ status: 200, body: paginate(req, draftMessages) }));
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
        inboxMessages = inboxMessages.filter((message) => message.auditUuid !== auditUuid);
        return respond(new HttpResponse({ status: 200 }));
    }

    if (req.url.includes('/api/messages/sent/')) {
        const auditUuid = getAudtiUUID(req);
        sentMessages = sentMessages.filter((message) => message.auditUuid !== auditUuid);
        return respond(new HttpResponse({ status: 200 }));
    }

    if (isAuthRequest(req.body) && req.url === 'http://localhost:9000/api/logout') {
        return respond(new HttpResponse<AuthResult>({ status: 200, body: { idToken: '', expiresIn: -3600 } }));
    }

    return next(req);
};
