import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MailService } from '@/features/messages/services/mail.service';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss'
})
export class Dashboard {
    private mailService = inject(MailService);
    private router = inject(Router);

    private inbox = this.mailService.getInbox();
    private sent = this.mailService.getSent();
    private drafts = this.mailService.getDrafts();

    inboxCount = computed(() => this.inbox()?.length ?? 0);
    unreadCount = computed(() => this.inbox()?.filter((m) => !m.readDate).length ?? 0);
    sentCount = computed(() => this.sent()?.length ?? 0);
    draftsCount = computed(() => this.drafts()?.length ?? 0);

    goTo(box: 'inbox' | 'sent' | 'drafts') {
        this.router.navigate(['/pages/messages', box]);
    }
}

