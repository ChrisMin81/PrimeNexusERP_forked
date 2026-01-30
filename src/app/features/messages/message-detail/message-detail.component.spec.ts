import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { signal, Signal } from '@angular/core';
import { convertToParamMap } from '@angular/router';

import { MessageDetail } from './message-detail.component';
import { MailService } from '@/features/messages/services/mail.service';
import { LoggerService } from '@/core/services/logger/logger';
import { Message } from 'api';

describe('MessageDetail Component', () => {
    let fixture: ComponentFixture<MessageDetail>;
    let component: MessageDetail;
    let mailService: jasmine.SpyObj<MailService>;
    let router: jasmine.SpyObj<Router>;

    const inboxSignal = signal<Message[] | undefined>(undefined);
    const sentSignal = signal<Message[] | undefined>(undefined);
    const draftsSignal = signal<Message[] | undefined>(undefined);

    const setup = async (box: 'inbox' | 'sent' | 'drafts', id: string) => {
        mailService = jasmine.createSpyObj<MailService>('MailService', [
            'getInbox',
            'getSent',
            'getDrafts',
            'markInboxAsRead'
        ]);
        mailService.getInbox.and.returnValue(inboxSignal as Signal<Message[] | undefined>);
        mailService.getSent.and.returnValue(sentSignal as Signal<Message[] | undefined>);
        mailService.getDrafts.and.returnValue(draftsSignal as Signal<Message[] | undefined>);

        router = jasmine.createSpyObj<Router>('Router', ['navigate', 'getCurrentNavigation']);
        router.navigate.and.resolveTo(true);
        router.getCurrentNavigation.and.returnValue(null);

        await TestBed.configureTestingModule({
            imports: [MessageDetail],
            providers: [
                { provide: MailService, useValue: mailService },
                { provide: Router, useValue: router },
                { provide: LoggerService, useValue: jasmine.createSpyObj('LoggerService', ['debug']) },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(convertToParamMap({ id })),
                        snapshot: {
                            paramMap: convertToParamMap({ id }),
                            data: { box }
                        }
                    }
                }
            ]
        })
            .overrideComponent(MessageDetail, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(MessageDetail);
        component = fixture.componentInstance;
        fixture.detectChanges();
    };

    it('uses inbox label and reply visibility for inbox', async () => {
        const id = '11111111-1111-1111-1111-111111111111';

        await setup('inbox', id);

        expect(component.timestampLabel()).toBe('Received');
        expect(component.showReply()).toBeTrue();
    });

    it('uses sent label and reply handling for sent box', async () => {
        const id = '11111111-1111-1111-1111-111111111111';

        await setup('sent', id);
        sentSignal.set([{ auditUuid: id, subject: 'Hello', body: 'Body', messageDate: '' } as Message]);
        await fixture.whenStable();

        expect(component.timestampLabel()).toBe('Sent');
        expect(component.showReply()).toBeTrue();
    });

    it('navigates to compose when editing a draft', async () => {
        const id = '11111111-1111-1111-1111-111111111111';
        const draftMessage = { auditUuid: id, subject: 'Draft', body: 'Body', recipientName: 'user@test.com', messageDate: '' } as Message;

        await setup('drafts', id);
        (component as unknown as { message: () => Message | null }).message = () => draftMessage;

        component.editDraft();

        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/compose'], {
            queryParams: {
                recipients: 'user@test.com',
                subject: 'Draft',
                content: 'Body',
                draftId: id
            }
        });
    });

    it('replies with a prefixed subject when not already prefixed', async () => {
        const id = '11111111-1111-1111-1111-111111111111';
        const message = {
            auditUuid: id,
            subject: 'Hello',
            body: 'Body',
            senderName: 'Alice',
            senderAddress: 'a@b.com',
            recipientName: 'Bob',
            messageDate: '2025-01-01'
        } as Message;

        await setup('inbox', id);
        (component as unknown as { message: () => Message | null }).message = () => message;

        component.reply();

        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/compose'], {
            queryParams: {
                recipients: 'Alice',
                subject: 'Re: Hello',
                content: `\n\n---- Original message ----\nFrom: Alice (a@b.com)\nTo: Bob\nSent: 2025-01-01\n\nBody`
            }
        });
    });
});
