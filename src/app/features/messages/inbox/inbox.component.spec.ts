import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Inbox } from './inbox.component';
import { MailService } from '@/features/messages/services/mail.service';
import { LoggerService } from '@/core/services/logger/logger';
import { Message } from 'api';
import { createSpyObj, type SpyObj } from '@/testing/spy';

describe('Inbox Component', () => {
    let fixture: ComponentFixture<Inbox>;
    let component: Inbox;
    let mailService: SpyObj<MailService>;
    let router: SpyObj<Router>;
    let logger: SpyObj<LoggerService>;

    const inboxSignal = signal<Message[] | undefined>(undefined);

    beforeEach(async () => {
        mailService = createSpyObj<MailService>(['getInbox', 'refreshInbox', 'deleteInboxMessage']);
        mailService.getInbox.mockReturnValue(inboxSignal as Signal<Message[] | undefined>);
        router = createSpyObj<Router>(['navigate']);
        router.navigate.mockResolvedValue(true);
        logger = createSpyObj<LoggerService>(['debug']);

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

        expect(component.attachmentsDialogOpen()).toBe(true);
        expect(component.attachmentList().length).toBe(1);
        expect(logger.debug).toHaveBeenCalled();
    });

    it('handles delete confirmation flow', () => {
        const message = { auditUuid: '1', subject: 'Test' } as Message;

        component.requestDelete(message);
        expect(component.confirmDialogVisible()).toBe(true);

        component.confirmDelete();
        expect(component.confirmDialogVisible()).toBe(false);
        expect(component.messagePendingDeletion()).toBeNull();
        expect(component.deletingId()).toBe('1');
        expect(mailService.deleteInboxMessage).toHaveBeenCalled();
    });
});
