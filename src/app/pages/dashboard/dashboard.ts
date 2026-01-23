import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '@/pages/messages/services/mail.service';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-12">
                <div class="card flex flex-col gap-2">
                    <p class="text-sm text-muted-color">Welcome back</p>
                    <h2 class="text-3xl font-semibold text-surface-900 dark:text-surface-0">Hi Chris, let's get things done.</h2>
                    <p class="text-muted-color">Your quick snapshot of messages and activity.</p>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <button class="card flex flex-col gap-3 text-left w-full" type="button" (click)="goTo('inbox')">
                    <div class="text-sm text-muted-color">Inbox</div>
                    <div class="text-4xl font-semibold text-surface-900 dark:text-surface-0">{{ inboxCount() }}</div>
                    <div class="text-sm text-green-500">{{ unreadCount() }} new</div>
                </button>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <button class="card flex flex-col gap-3 text-left w-full" type="button" (click)="goTo('sent')">
                    <div class="text-sm text-muted-color">Sent</div>
                    <div class="text-4xl font-semibold text-surface-900 dark:text-surface-0">{{ sentCount() }}</div>
                    <div class="text-sm text-muted-color">Sent messages</div>
                </button>
            </div>

            <div class="col-span-12 lg:col-span-4">
                <button class="card flex flex-col gap-3 text-left w-full" type="button" (click)="goTo('drafts')">
                    <div class="text-sm text-muted-color">Drafts</div>
                    <div class="text-4xl font-semibold text-surface-900 dark:text-surface-0">{{ draftsCount() }}</div>
                    <div class="text-sm text-orange-500">Finish and send your drafts</div>
                </button>
            </div>
        </div>
    `
})
export class Dashboard {
    private mailService = inject(MailService);
    constructor(private router: Router) {}

    private inbox = this.mailService.getInbox();
    private sent = this.mailService.getSent();
    private drafts = this.mailService.getDrafts();

    inboxCount = computed(() => this.inbox()?.length ?? 0);
    unreadCount = computed(() => (this.inbox()?.filter((m) => !m.isRead).length ?? 0));
    sentCount = computed(() => this.sent()?.length ?? 0);
    draftsCount = computed(() => this.drafts()?.length ?? 0);

    goTo(box: 'inbox' | 'sent' | 'drafts') {
        this.router.navigate(['/pages/messages', box]);
    }
}
