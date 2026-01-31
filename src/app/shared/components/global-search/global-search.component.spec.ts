import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { GlobalSearchComponent } from './global-search.component';
import { MenuModelService } from '@/layout/service/menu-model.service';
import { MailService } from '@/features/messages/services/mail.service';
import { GlobalHotkeyService } from '@/core/services/global-hotkey.service';
import { Message } from 'api';
import { MenuItem } from 'primeng/api';
import { createSpyObj, type SpyObj } from '@/testing/spy';

describe('GlobalSearchComponent', () => {
    let fixture: ComponentFixture<GlobalSearchComponent>;
    let component: GlobalSearchComponent;
    let router: SpyObj<Router>;
    let menuModel: SpyObj<MenuModelService>;
    let mailService: SpyObj<MailService>;
    let hotkeys: { ctrlF$: Subject<void> };

    const inboxSignal = signal<Message[] | undefined>(undefined);
    const sentSignal = signal<Message[] | undefined>(undefined);
    const draftsSignal = signal<Message[] | undefined>(undefined);

    beforeEach(async () => {
        router = createSpyObj<Router>(['navigate']);
        router.navigate.mockResolvedValue(true);
        menuModel = createSpyObj<MenuModelService>(['getMenuItems']);
        mailService = createSpyObj<MailService>(['getInbox', 'getSent', 'getDrafts']);
        mailService.getInbox.mockReturnValue(inboxSignal as Signal<Message[] | undefined>);
        mailService.getSent.mockReturnValue(sentSignal as Signal<Message[] | undefined>);
        mailService.getDrafts.mockReturnValue(draftsSignal as Signal<Message[] | undefined>);
        hotkeys = { ctrlF$: new Subject<void>() };

        const menuItems: MenuItem[] = [
            { label: 'Inbox', routerLink: ['/pages/messages/inbox'] },
            { label: 'Settings', routerLink: ['/settings'] },
            {
                label: 'Messages',
                items: [{ label: 'Sent', routerLink: ['/pages/messages/sent'] }]
            }
        ];
        menuModel.getMenuItems.mockReturnValue(menuItems);

        await TestBed.configureTestingModule({
            imports: [GlobalSearchComponent],
            providers: [
                { provide: MenuModelService, useValue: menuModel },
                { provide: MailService, useValue: mailService },
                { provide: Router, useValue: router },
                { provide: GlobalHotkeyService, useValue: hotkeys }
            ]
        })
            .overrideComponent(GlobalSearchComponent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(GlobalSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('normalizes the search term and produces menu results', () => {
        component.onSearchChange('InBoX');

        expect(component.normalizedTerm()).toBe('inbox');
        expect(component.menuResults().map((item) => item.label)).toContain('Inbox');
    });

    it('produces message results that match the term', () => {
        inboxSignal.set([
            { auditUuid: '1', subject: 'Invoice', body: 'Body', senderAddress: 'a@b.com', messageDate: '' } as Message
        ]);

        component.onSearchChange('invoice');

        expect(component.messageResults().length).toBe(1);
        expect(component.messageResults()[0].route).toEqual(['/pages/messages', 'inbox', '1']);
    });

    it('navigates to a result and clears state', () => {
        component.searchTerm.set('test');
        component.expanded.set(true);

        component.navigateTo({ id: '1', label: 'Inbox', route: ['/pages/messages/inbox'], type: 'menu' });

        expect(router.navigate).toHaveBeenCalledWith(['/pages/messages/inbox']);
        expect(component.searchTerm()).toBe('');
        expect(component.expanded()).toBe(false);
    });

    it('clears the search term on cleared', () => {
        component.searchTerm.set('value');

        component.onCleared();

        expect(component.searchTerm()).toBe('');
    });
});
