import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Sent } from './sent.component';
import { MailService } from '@/features/messages/services/mail.service';
import { Message } from 'api';

describe('Sent Component', () => {
    let fixture: ComponentFixture<Sent>;
    let component: Sent;
    let mailService: jasmine.SpyObj<MailService>;
    let router: jasmine.SpyObj<Router>;

    const sentSignal = signal<Message[] | undefined>(undefined);

    beforeEach(async () => {
        mailService = jasmine.createSpyObj<MailService>('MailService', ['getSent', 'refreshSent', 'deleteSentMessage']);
        mailService.getSent.and.returnValue(sentSignal as Signal<Message[] | undefined>);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.resolveTo(true);

        await TestBed.configureTestingModule({
            imports: [Sent],
            providers: [
                { provide: MailService, useValue: mailService },
                { provide: Router, useValue: router }
            ]
        })
            .overrideComponent(Sent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(Sent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('filters messages based on the search term', async () => {
        component.onSearch('hello');
        sentSignal.set([{ auditUuid: '1', subject: 'Hello', body: 'Body', messageDate: '' } as Message]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filteredMessages().length).toBe(1);
    });

    it('refreshes sent messages', () => {
        component.refresh();
        expect(mailService.refreshSent).toHaveBeenCalled();
    });

    it('navigates to a sent message', () => {
        component.openMessage({ auditUuid: 'abc' } as Message);
        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/sent', 'abc']);
    });

    it('opens and closes attachments', () => {
        component.openAttachments(new Event('click'), { attachments: [] } as Message);
        expect(component.attachmentsDialogOpen()).toBeTrue();

        component.closeAttachments();
        expect(component.attachmentsDialogOpen()).toBeFalse();
    });

    it('handles delete confirmation flow', () => {
        const message = { auditUuid: '1', subject: 'Test' } as Message;

        component.requestDelete(message);
        expect(component.confirmDialogVisible()).toBeTrue();
        expect(component.messagePendingDeletion()).toBe(message);

        component.confirmDelete();
        expect(component.confirmDialogVisible()).toBeFalse();
        expect(component.messagePendingDeletion()).toBeNull();
        expect(component.deletingId()).toBe('1');
        expect(mailService.deleteSentMessage).toHaveBeenCalled();

        component.cancelDelete();
        expect(component.messagePendingDeletion()).toBeNull();
    });
});
