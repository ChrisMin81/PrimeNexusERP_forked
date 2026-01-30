import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Drafts } from './drafts.component';
import { MailService } from '@/features/messages/services/mail.service';
import { Message } from 'api';

describe('Drafts Component', () => {
    let fixture: ComponentFixture<Drafts>;
    let component: Drafts;
    let mailService: jasmine.SpyObj<MailService>;
    let router: jasmine.SpyObj<Router>;

    const draftsSignal = signal<Message[] | undefined>(undefined);

    beforeEach(async () => {
        mailService = jasmine.createSpyObj<MailService>('MailService', ['getDrafts', 'refreshDrafts']);
        mailService.getDrafts.and.returnValue(draftsSignal as Signal<Message[] | undefined>);
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.resolveTo(true);

        await TestBed.configureTestingModule({
            imports: [Drafts],
            providers: [
                { provide: MailService, useValue: mailService },
                { provide: Router, useValue: router }
            ]
        })
            .overrideComponent(Drafts, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(Drafts);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('filters draft messages based on the search term', async () => {
        component.onSearch('draft');
        draftsSignal.set([{ auditUuid: '1', subject: 'Draft', body: 'Body', messageDate: '' } as Message]);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(component.filteredMessages().length).toBe(1);
    });

    it('refreshes drafts', () => {
        component.refresh();
        expect(mailService.refreshDrafts).toHaveBeenCalled();
    });

    it('navigates to a draft message', () => {
        component.openMessage({ auditUuid: 'abc' } as Message);
        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/drafts', 'abc']);
    });

    it('opens and closes attachments', () => {
        component.openAttachments(new Event('click'), { attachments: [] } as Message);
        expect(component.attachmentsDialogOpen()).toBeTrue();

        component.closeAttachments();
        expect(component.attachmentsDialogOpen()).toBeFalse();
    });

    it('routes to composer for edit/send', () => {
        const message = { auditUuid: '1', subject: 'Subject', body: 'Body', recipientName: 'user@test.com' } as Message;

        component.editDraft(message);
        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/compose'], {
            queryParams: {
                recipients: 'user@test.com',
                subject: 'Subject',
                content: 'Body',
                draftId: '1'
            }
        });
    });
});
