import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '@/pages/messages/services/mail.service';
import { Message } from '@/api/models/message';
import { MailToolbar } from '@/pages/messages/components/mail-toolbar/mail-toolbar';
import { MessageAttachment } from '@/api/models/message-attachment';
import { FileDownloadsOverlay } from '@/pages/common/components/file-downloads-overlay/file-downloads-overlay.component';
import { ConfirmDialog } from '@/pages/common/components/confirm-dialog/confirm-dialog.component';
import { LoggerService } from '@/services/logger/logger';

@Component({
    selector: 'app-inbox',
    imports: [CommonModule, AvatarModule, BadgeModule, ButtonModule, InputTextModule, TableModule, TagModule, RouterModule, MailToolbar, FileDownloadsOverlay, ConfirmDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './inbox.html',
    styleUrl: './inbox.scss'
})
export class Inbox {
    private logger = inject(LoggerService);
    private mailService = inject(MailService);
    router = inject(Router);
    deletingId = signal<string | null>(null);
    messages$ = this.mailService.getInbox();
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
            const term = this.searchTerm().trim().toLowerCase();
            if (!messages) {
                this.filteredMessages.set([]);
                return;
            }
            if (!term) {
                this.filteredMessages.set(messages);
                return;
            }
            this.filteredMessages.set(
                messages.filter((message) => {
                    const haystack = `${message.subject} ${message.senderAddress} ${message.recipientName} ${message.body}`.toLowerCase();
                    return haystack.includes(term);
                })
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

    openAttachments(event: Event, message: Message) {
        event.stopPropagation();
        const attachments = message?.attachments ?? [];
        this.logger.debug(
            `Opening attachments for message ${message.auditUuid}`,
            attachments?.map((a) => a.baseName)
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
