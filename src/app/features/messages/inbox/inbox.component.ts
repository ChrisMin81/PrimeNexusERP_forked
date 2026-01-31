import { ChangeDetectionStrategy, Component, Signal, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MailService } from '@/features/messages/services/mail.service';
import { MailToolbar } from '@/features/messages/components/mail-toolbar/mail-toolbar.component';
import { FileDownloadsOverlay } from '@/shared/components/file-downloads-overlay/file-downloads-overlay.component';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { LoggerService } from '@/core/services/logger/logger';
import { MessageTableComponent } from '@/features/messages/components/message-table/message-table.component';
import { Message, MessageAttachment } from 'api';
import { filterMessagesByTerm } from '@/features/messages/utils/message-filter';

@Component({
    selector: 'app-inbox',
    imports: [CommonModule, MailToolbar, FileDownloadsOverlay, ConfirmDialog, MessageTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './inbox.component.html',
    styleUrl: './inbox.component.scss'
})
export class Inbox {
    private logger = inject(LoggerService);
    private mailService = inject(MailService);
    router = inject(Router);
    deletingId = signal<string | null>(null);
    messages$: Signal<Message[] | undefined> = this.mailService.getInbox();
    searchTerm = signal('');
    filteredMessages = signal<Message[]>([]);
    attachmentList = signal<MessageAttachment[]>([]);
    attachmentsDialogOpen = signal(false);
    confirmDialogVisible = signal(false);
    messagePendingDeletion = signal<Message | null>(null);
    confirmDialogMessage = computed(() => {
        const pending = this.messagePendingDeletion();
        if (!pending) {
            return 'Delete this message?';
        }
        return `Delete "${pending.subject}" from your inbox?`;
    });

    constructor() {
        effect(() => {
            const messages = this.messages$();
            const term = this.searchTerm();
            this.filteredMessages.set(
                filterMessagesByTerm(messages, term, ['subject', 'senderAddress', 'recipientName', 'body', 'senderName'])
            );
        });
    }

    refresh() {
        this.mailService.refreshInbox();
    }

    onSearch(value: string) {
        this.searchTerm.set(value);
    }

    reply(message: Message) {
        const replySubject = message.subject?.startsWith('Re:') ? message.subject : `Re: ${message.subject}`;
        this.router.navigate(['/pages/messages/compose'], {
            queryParams: {
                recipients: message.senderAddress,
                subject: replySubject,
                content: `\n\n---- Original message ----\nFrom: ${message.senderAddress}\nTo: ${message.recipientName}\nSent: ${message.messageDate}\n\n${message.body}`
            }
        });
    }

    openMessage(message: Message) {
        this.router.navigate(['/pages/messages/inbox', message.auditUuid]);
    }

    openAttachments(_event: Event, message: Message) {
        const attachments = message?.attachments ?? [];
        this.logger.debug(
            `Opening attachments for message ${message.auditUuid}`,
            attachments?.map((attachment: MessageAttachment) => attachment.baseName)
        );
        this.attachmentList.set([...attachments]);
        this.attachmentsDialogOpen.set(true);
    }

    closeAttachments() {
        this.attachmentsDialogOpen.set(false);
    }

    requestDelete(message: Message) {
        if (this.deletingId() !== null) {
            return;
        }
        this.messagePendingDeletion.set(message);
        this.confirmDialogVisible.set(true);
    }

    confirmDelete() {
        const pending = this.messagePendingDeletion();
        if (!pending) {
            this.confirmDialogVisible.set(false);
            return;
        }
        this.deletingId.set(pending.auditUuid ?? null);
        this.confirmDialogVisible.set(false);
        this.messagePendingDeletion.set(null);
        this.mailService.deleteInboxMessage(this.deletingId);
    }

    cancelDelete() {
        this.confirmDialogVisible.set(false);
        this.messagePendingDeletion.set(null);
    }
}


