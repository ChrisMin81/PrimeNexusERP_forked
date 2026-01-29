import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { toSignal } from '@angular/core/rxjs-interop';
import { Mailbox, MailService } from '@/pages/messages/services/mail.service';
import { Message } from '@/api/models/message';
import { FileList } from '@/pages/common/components/file-downloads-overlay/file-list/file-list';
import { validate as isValidUUID } from 'uuid';
import { LoggerService } from '@/services/logger/logger';

@Component({
    selector: 'app-message-detail',
    imports: [CommonModule, RouterModule, ButtonModule, TagModule, FileList],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './message-detail.html',
    styleUrl: './message-detail.scss'
})
export class MessageDetail {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private mailService = inject(MailService);
    private logger = inject(LoggerService);
    private paramMap = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
    private boxData = computed(() => (this.route.snapshot.data['box'] as Mailbox) ?? 'inbox');
    private mailboxList = computed<Signal<Message[] | undefined>>(() => {
        switch (this.boxData()) {
            case 'inbox':
                return this.mailService.getInbox();
            case 'sent':
                return this.mailService.getSent();
            case 'drafts':
                return this.mailService.getDrafts();
        }
    });

    message = computed<Message | null>(() => {
        const paramMap = this.paramMap();
        const id = paramMap.get('id');
        const list = this.mailboxList()();
        if (!id || !isValidUUID(id) || !list) {
            return null;
        }
        return list.find((m) => m.auditUuid === id) ?? null;
    });
    messageAttachments = computed(() => {
        return this.message()?.attachments ?? [];
    });

    title = computed(() => {
        const current = this.message();
        return current?.subject ?? 'Message';
    });

    timestampLabel = computed(() => (this.boxData() === 'sent' ? 'Sent' : this.boxData() === 'drafts' ? 'Saved' : 'Received'));
    isDraft = computed(() => this.boxData() === 'drafts');
    showReply = computed(() => !this.isDraft());
    constructor() {
        effect(() => {
            const box = this.boxData();
            const current = this.message();
            if (box === 'inbox' && current && !current.readDate && isValidUUID(current.auditUuid)) {
                this.mailService.markInboxAsRead(current.auditUuid!);
            }
        });
    }

    backLink(): string[] {
        const navState = this.router.getCurrentNavigation()?.previousNavigation;
        const from = navState?.finalUrl?.toString();
        if (from?.includes('/pages/messages/')) {
            return [from];
        }
        return ['/pages/messages', this.boxData()];
    }

    editDraft() {
        const msg = this.message();
        if (!msg) {
            return;
        }
        this.router.navigate(['/pages/messages/compose'], {
            queryParams: {
                recipients: msg.recipientName,
                subject: msg.subject,
                content: msg.body,
                draftId: msg.auditUuid
            }
        });
    }

    reply() {
        const msg = this.message();
        if (!msg) {
            return;
        }
        const replySubject = msg.subject?.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`;
        this.router.navigate(['/pages/messages/compose'], {
            queryParams: {
                recipients: msg.senderName,
                subject: replySubject,
                content: `\n\n---- Original message ----\nFrom: ${msg.senderName} (${msg.senderAddress})\nTo: ${msg.recipientName}\nSent: ${msg.messageDate}\n\n${msg.body}`
            }
        });
    }
}
