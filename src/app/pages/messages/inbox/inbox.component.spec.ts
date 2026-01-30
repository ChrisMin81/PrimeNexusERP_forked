import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Inbox } from './inbox.component';
import { MailService } from '@/pages/messages/services/mail.service';
import { LoggerService } from '@/services/logger/logger';
import { Message } from 'api';

describe('Inbox Component', () => {
    let fixture: ComponentFixture<Inbox>;
    let component: Inbox;
    let mailService: jasmine.SpyObj<MailService>;
    let router: jasmine.SpyObj<Router>;
    let logger: jasmine.SpyObj<LoggerService>;

    const inboxSignal = signal<Message[] | undefined>(undefined);

    beforeEach(async () => {
        mailService = jasmine.createSpyObj<MailService>('MailService', ['getInbox', 'refreshInbox', 'deleteInboxMessage']);
        mailService.getInbox.and.returnValue(inboxSignal as Signal<Message[] | undefined>);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.resolveTo(true);
        logger = jasmine.createSpyObj<LoggerService>('LoggerService', ['debug']);

        await TestBed.configureTestingModule({
            imports: [Inbox],
            providers: [
                { provide: MailService, useValue: mailService },
                { provide: Router, useValue: router },
                { provide: LoggerService, useValue: logger }
            ]
        })
            .overrideComponent(Inbox, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(Inbox);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('filters inbox messages based on the search term', async () => {
        component.onSearch('hello');
        inboxSignal.set([{ auditUuid: '1', subject: 'Hello', body: 'Body', messageDate: '' } as Message]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filteredMessages().length).toBe(1);
    });

    it('refreshes inbox', () => {
        component.refresh();
        expect(mailService.refreshInbox).toHaveBeenCalled();
    });

    it('navigates to reply with proper subject', () => {
        const message = {
            auditUuid: '1',
            subject: 'Subject',
            senderAddress: 'sender@test.com',
            recipientName: 'recipient@test.com',
            messageDate: '2025-01-01',
            body: 'Body'
        } as Message;

        component.reply(message);

        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/compose'], {
            queryParams: {
                recipients: 'sender@test.com',
                subject: 'Re: Subject',
                content: `\n\n---- Original message ----\nFrom: sender@test.com\nTo: recipient@test.com\nSent: 2025-01-01\n\nBody`
            }
        });
    });

    it('opens attachments and logs', () => {
        const message = { auditUuid: '1', attachments: [{ baseName: 'file.txt' }] } as Message;

        component.openAttachments(new Event('click'), message);

        expect(component.attachmentsDialogOpen()).toBeTrue();
        expect(component.attachmentList().length).toBe(1);
        expect(logger.debug).toHaveBeenCalled();
    });

    it('handles delete confirmation flow', () => {
        const message = { auditUuid: '1', subject: 'Test' } as Message;

        component.requestDelete(message);
        expect(component.confirmDialogVisible()).toBeTrue();

        component.confirmDelete();
        expect(component.confirmDialogVisible()).toBeFalse();
        expect(component.messagePendingDeletion()).toBeNull();
        expect(component.deletingId()).toBe('1');
        expect(mailService.deleteInboxMessage).toHaveBeenCalled();
    });
});
