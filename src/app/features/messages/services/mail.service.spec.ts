import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { MailService } from './mail.service';
import { LoggerService } from '@/core/services/logger/logger';
import { LoadingService } from '@/core/services/loading/loading.service';
import { Message } from 'api';

describe('MailService', () => {
    let service: MailService;
    let http: jasmine.SpyObj<HttpClient>;
    let loadingService: jasmine.SpyObj<LoadingService>;
    let logger: jasmine.SpyObj<LoggerService>;

    beforeEach(() => {
        http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get', 'post', 'delete']);
        loadingService = jasmine.createSpyObj<LoadingService>('LoadingService', ['showLoaderUntilCompleted']);
        loadingService.showLoaderUntilCompleted.and.callFake((source) => source);
        logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['trace']);

        TestBed.configureTestingModule({
            providers: [
                MailService,
                { provide: HttpClient, useValue: http },
                { provide: LoadingService, useValue: loadingService },
                { provide: LoggerService, useValue: logger }
            ]
        });

        service = TestBed.inject(MailService);
    });

    it('sends mail and updates sent/drafts state', () => {
        const sentMessage = { auditUuid: '1', subject: 'Subject', body: 'Body', messageDate: '' } as Message;
        http.post.and.returnValue(of(sentMessage));
        http.get.and.returnValue(of([]));

        const draftsSignal = signal<Message[] | undefined>([{ auditUuid: 'draft-1' } as Message]);
        (service as unknown as { draftsSignal: typeof draftsSignal }).draftsSignal = draftsSignal;

        const result = service.sendMail({
            recipients: ['a@b.com', 'b@b.com'],
            subject: 'Subject',
            body: 'Body',
            auditUuid: 'draft-1'
        });

        expect(http.post).toHaveBeenCalledWith('/api/messages/send', {
            recipients: ['a@b.com', 'b@b.com'],
            subject: 'Subject',
            body: 'Body',
            recipientName: 'a@b.com, b@b.com'
        });
        expect(result()).toEqual(sentMessage);
        expect(draftsSignal()?.length).toBe(0);
    });

    it('deletes inbox messages and clears the delete signal', () => {
        const inboxMessage = { auditUuid: 'abc', subject: 'Hello', body: 'Body', messageDate: '' } as Message;
        http.get.and.returnValue(of([inboxMessage]));
        http.delete.and.returnValue(of(void 0));

        const inboxSignal = service.getInbox();
        expect(inboxSignal()?.length).toBe(1);

        const deleteId = signal<string | null>('abc');
        service.deleteInboxMessage(deleteId);

        expect(inboxSignal()?.length).toBe(0);
        expect(deleteId()).toBeNull();
    });

    it('refreshes inbox by reloading messages', () => {
        http.get.and.returnValue(of([]));

        service.getInbox();
        service.refreshInbox();

        expect(http.get).toHaveBeenCalledTimes(2);
    });

    it('marks inbox message as read', () => {
        const inboxMessage = { auditUuid: 'abc', subject: 'Hello', body: 'Body', messageDate: '' } as Message;
        http.get.and.returnValue(of([inboxMessage]));

        const inboxSignal = service.getInbox();
        service.markInboxAsRead('abc');

        expect(inboxSignal()?.[0].readDate).toBeTruthy();
    });
});
