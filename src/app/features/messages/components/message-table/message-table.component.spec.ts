import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageTableComponent } from './message-table.component';
import { Message } from 'api';
import { vi } from 'vitest';

describe('MessageTableComponent', () => {
    let fixture: ComponentFixture<MessageTableComponent>;
    let component: MessageTableComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessageTableComponent]
        })
            .overrideComponent(MessageTableComponent, { set: { template: '' } })
            .compileComponents();

        fixture = TestBed.createComponent(MessageTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('computes headers and avatar visibility by context', () => {
        fixture.componentRef.setInput('context', 'drafts');
        fixture.detectChanges();

        expect(component.hasAvatar()).toBe(false);
        expect(component.primaryHeader()).toBe('To');
        expect(component.timestampHeader()).toBe('Updated');

        fixture.componentRef.setInput('context', 'inbox');
        fixture.detectChanges();

        expect(component.hasAvatar()).toBe(true);
        expect(component.primaryHeader()).toBe('Sender');
        expect(component.timestampHeader()).toBe('Received');
    });

    it('derives labels and values based on context', () => {
        const message = {
            auditUuid: '1',
            subject: 'Subject',
            body: 'Body',
            senderAddress: 'sender@site.com',
            recipientName: 'Recipient',
            messageDate: ''
        } as Message;

        fixture.componentRef.setInput('context', 'inbox');
        fixture.detectChanges();

        expect(component.avatarLabel(message)).toBe('s');
        expect(component.primaryValue(message)).toBe('sender@site.com');
        expect(component.secondaryValue(message)).toBe('Recipient');

        fixture.componentRef.setInput('context', 'sent');
        fixture.detectChanges();

        expect(component.avatarLabel(message)).toBe('R');
        expect(component.primaryValue(message)).toBe('Recipient');
        expect(component.secondaryValue(message)).toBe('sender@site.com');
    });

    it('marks rows as deleting based on loadingDeleteId', () => {
        const message = { auditUuid: 'abc' } as Message;
        fixture.componentRef.setInput('loadingDeleteId', 'abc');
        fixture.detectChanges();

        expect(component.isDeleting(message)).toBe(true);
    });

    it('emits outputs for row actions', () => {
        const message = { auditUuid: '1' } as Message;
        const stopEvent = { stopPropagation: vi.fn() } as unknown as Event;
        const emitted: string[] = [];

        component.open.subscribe(() => emitted.push('open'));
        component.reply.subscribe(() => emitted.push('reply'));
        component.delete.subscribe(() => emitted.push('delete'));
        component.editDraft.subscribe(() => emitted.push('edit'));
        component.sendDraft.subscribe(() => emitted.push('send'));

        component.onOpen(message);
        component.onReply(stopEvent, message);
        component.onDelete(stopEvent, message);
        component.onEditDraft(stopEvent, message);
        component.onSendDraft(stopEvent, message);

        expect(stopEvent.stopPropagation).toHaveBeenCalledTimes(4);
        expect(emitted).toEqual(['open', 'reply', 'delete', 'edit', 'send']);
    });
});
