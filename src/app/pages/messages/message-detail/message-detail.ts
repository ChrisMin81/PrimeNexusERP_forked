import { ChangeDetectionStrategy, Component, Signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { toSignal } from '@angular/core/rxjs-interop';
import { MailService, Mailbox } from '@/pages/messages/services/mail.service';
import { Message } from '@/pages/messages/models/message';

@Component({
    selector: 'app-message-detail',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule, TagModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './message-detail.html',
    styleUrl: './message-detail.scss'
})
export class MessageDetail {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private mailService = inject(MailService);

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
        const id = Number(paramMap.get('id'));
        const list = this.mailboxList()();
        if (Number.isNaN(id) || !list) {
            return null;
        }
        return list.find((m) => m.id === id) ?? null;
    });

    title = computed(() => {
        const current = this.message();
        return current?.subject ?? 'Message';
    });

    timestampLabel = computed(() => (this.boxData() === 'sent' ? 'Sent' : this.boxData() === 'drafts' ? 'Saved' : 'Received'));
    isDraft = computed(() => this.boxData() === 'drafts');
    showReply = computed(() => !this.isDraft());
    private fallbackRoute = ['/pages/messages', 'inbox'];

    constructor() {
        effect(() => {
            const box = this.boxData();
            const current = this.message();
            if (box === 'inbox' && current && !current.isRead) {
                this.mailService.markInboxAsRead(current.id);
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
                recipients: msg.recipients.join(','),
                subject: msg.subject,
                content: msg.content,
                draftId: msg.id
            }
        });
    }

    reply() {
        const msg = this.message();
        if (!msg) {
            return;
        }
        const replySubject = msg.subject.startsWith('Re:') ? msg.subject : `Re: ${msg.subject}`;
        this.router.navigate(['/pages/messages/compose'], {
            queryParams: {
                recipients: msg.sender,
                subject: replySubject,
                content: `\n\n---- Original message ----\nFrom: ${msg.sender}\nTo: ${msg.recipients.join(', ')}\nSent: ${msg.timestamp}\n\n${msg.content}`
            }
        });
    }
}
