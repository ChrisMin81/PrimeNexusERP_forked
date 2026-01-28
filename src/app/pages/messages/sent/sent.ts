import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MailService } from '@/pages/messages/services/mail.service';
import { Router, RouterModule } from '@angular/router';
import { Message } from '@/pages/messages/models/message';
import { MailToolbar } from '@/pages/messages/components/mail-toolbar/mail-toolbar';
import { Attachment } from '@/pages/messages/models/attachment';
import { FileDownloadsOverlay } from '@/pages/common/components/file-downloads-overlay/file-downloads-overlay.component';
import { ConfirmDialog } from '@/pages/common/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-sent',
    imports: [CommonModule, AvatarModule, BadgeModule, ButtonModule, InputTextModule, TableModule, TagModule, RouterModule, MailToolbar, FileDownloadsOverlay, ConfirmDialog],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './sent.html',
    styleUrl: './sent.scss'
})
export class Sent {
    private mailService = inject(MailService);
    router = inject(Router);
    deletingId = signal<number | null>(null);
    messages$ = this.mailService.getSent();
    searchTerm = signal('');
    filteredMessages = signal<Message[]>([]);
    attachmentList = signal<Attachment[]>([]);
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
                    const haystack = `${message.subject} ${message.sender} ${message.recipients.join(' ')} ${message.content}`.toLowerCase();
                    return haystack.includes(term);
                })
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
        this.router.navigate(['/pages/messages/sent', message.id]);
    }

    openAttachments(event: Event, message: Message) {
        event.stopPropagation();
        this.attachmentList.set(message.attachments);
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
        this.deletingId.set(pending.id);
        this.confirmDialogVisible.set(false);
        this.messagePendingDeletion.set(null);
        this.mailService.deleteSentMessage(this.deletingId);
    }

    cancelDelete() {
        this.confirmDialogVisible.set(false);
        this.messagePendingDeletion.set(null);
    }
}
