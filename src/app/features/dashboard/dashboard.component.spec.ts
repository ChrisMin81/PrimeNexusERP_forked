import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Signal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Dashboard } from './dashboard.component';
import { MailService } from '@/features/messages/services/mail.service';
import { Message } from 'api';

describe('Dashboard Component', () => {
    let fixture: ComponentFixture<Dashboard>;
    let component: Dashboard;
    let router: jasmine.SpyObj<Router>;
    let mailService: jasmine.SpyObj<MailService>;

    const inboxSignal = signal<Message[] | undefined>(undefined);
    const sentSignal = signal<Message[] | undefined>(undefined);
    const draftsSignal = signal<Message[] | undefined>(undefined);

    beforeEach(async () => {
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);
        router.navigate.and.resolveTo(true);
        mailService = jasmine.createSpyObj<MailService>('MailService', ['getInbox', 'getSent', 'getDrafts']);
        mailService.getInbox.and.returnValue(inboxSignal as Signal<Message[] | undefined>);
        mailService.getSent.and.returnValue(sentSignal as Signal<Message[] | undefined>);
        mailService.getDrafts.and.returnValue(draftsSignal as Signal<Message[] | undefined>);

        await TestBed.configureTestingModule({
            imports: [Dashboard],
            providers: [
                { provide: MailService, useValue: mailService },
                { provide: Router, useValue: router }
            ]
        })
            .overrideComponent(Dashboard, {
                set: {
                    template: ''
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Dashboard);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('computes counts from mail signals', () => {
        inboxSignal.set([
            { auditUuid: '1', subject: 'a', body: 'x', messageDate: '' } as Message,
            { auditUuid: '2', subject: 'b', body: 'y', messageDate: '', readDate: '2025-01-01' } as Message
        ]);
        sentSignal.set([{ auditUuid: '3', subject: 'c', body: 'z', messageDate: '' } as Message]);
        draftsSignal.set(undefined);

        expect(component.inboxCount()).toBe(2);
        expect(component.unreadCount()).toBe(1);
        expect(component.sentCount()).toBe(1);
        expect(component.draftsCount()).toBe(0);
    });

    it('navigates to the selected mailbox', () => {
        component.goTo('inbox');

        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages', 'inbox']);
    });
});
