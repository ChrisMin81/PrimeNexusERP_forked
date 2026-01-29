import { ChangeDetectionStrategy, Component, Signal, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MailService } from '@/pages/messages/services/mail.service';
import { MailToolbar } from '@/pages/messages/components/mail-toolbar/mail-toolbar';
import { MessageAttachment } from '@/api/models/message-attachment';
import { FileDownloadsOverlay } from '@/pages/common/components/file-downloads-overlay/file-downloads-overlay.component';
import { MessageTableComponent } from '@/pages/messages/components/message-table/message-table.component';
import { filterMessagesByTerm } from '@/pages/messages/utils/message-filter';
import { Message } from '@/api/models/message';

@Component({
    selector: 'app-drafts',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, MailToolbar, FileDownloadsOverlay, MessageTableComponent],
    templateUrl: './drafts.html',
    styleUrl: './drafts.scss'
})
export class Drafts {
    private mailService = inject(MailService);
    router = inject(Router);
    messages$: Signal<Message[] | undefined> = this.mailService.getDrafts();
    searchTerm = signal('');
    filteredMessages = signal<Message[]>([]);
    attachmentList = signal<MessageAttachment[]>([]);
    attachmentsDialogOpen = signal(false);

    constructor() {
        effect(() => {
            const messages = this.messages$();
            const term = this.searchTerm();
            this.filteredMessages.set(filterMessagesByTerm(messages, term, ['subject', 'recipientName', 'body']));
        });
    }

    refresh() {
        this.mailService.refreshDrafts();
    }

    onSearch(value: string) {
        this.searchTerm.set(value);
    }

    openMessage(message: Message) {
        this.router.navigate(['/pages/messages/drafts', message.auditUuid]);
    }

    openAttachments(_event: Event, message: Message) {
        this.attachmentList.set(message.attachments ?? []);
        this.attachmentsDialogOpen.set(true);
    }

    closeAttachments() {
        this.attachmentsDialogOpen.set(false);
    }

    editDraft(message: Message) {
        this.navigateToComposer(message);
    }

    sendDraft(message: Message) {
        this.navigateToComposer(message);
    }

    private navigateToComposer(message: Message) {
        const recipientList = message.recipientName ? [message.recipientName] : [];
        this.router.navigate(['/pages/messages/compose'], {
            queryParams: {
                recipients: recipientList.join(','),
                subject: message.subject,
                content: message.body,
                draftId: message.auditUuid
            }
        });
    }
}
