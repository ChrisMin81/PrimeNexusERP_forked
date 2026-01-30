import { ChangeDetectionStrategy, Component, Signal, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailService } from '@/features/messages/services/mail.service';
import { Router } from '@angular/router';
import { MailToolbar } from '@/features/messages/components/mail-toolbar/mail-toolbar.component';
import { FileDownloadsOverlay } from '@/shared/components/file-downloads-overlay/file-downloads-overlay.component';
import { ConfirmDialog } from '@/shared/components/confirm-dialog/confirm-dialog.component';
import { MessageAttachment } from 'api';
import { MessageTableComponent } from '@/features/messages/components/message-table/message-table.component';
import { filterMessagesByTerm } from '@/features/messages/utils/message-filter';
import { Message } from 'api';

@Component({
    selector: 'app-sent',
    imports: [CommonModule, MailToolbar, FileDownloadsOverlay, ConfirmDialog, MessageTableComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './sent.component.html',
    styleUrl: './sent.component.scss'
})
export class Sent {
    private mailService = inject(MailService);
    router = inject(Router);
    deletingId = signal<string | null>(null);
    messages$: Signal<Message[] | undefined> = this.mailService.getSent();
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
        return `Delete "${pending.subject}" from your sent items?`;
    });

    constructor() {
        effect(() => {
            const messages = this.messages$();
            const term = this.searchTerm();
            this.filteredMessages.set(
                filterMessagesByTerm(messages, term, ['subject', 'senderAddress', 'senderName', 'recipientName', 'body'])
            );
        });
    }

    refresh() {
        this.mailService.refreshSent();
    }

    onSearch(value: string) {
        this.searchTerm.set(value);
    }

    openMessage(message: Message) {
        this.router.navigate(['/pages/messages/sent', message.auditUuid]);
    }

    openAttachments(_event: Event, message: Message) {
        this.attachmentList.set(message.attachments ?? []);
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
        this.mailService.deleteSentMessage(this.deletingId);
    }

    cancelDelete() {
        this.confirmDialogVisible.set(false);
        this.messagePendingDeletion.set(null);
    }
}


