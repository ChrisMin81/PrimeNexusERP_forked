import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MailService } from '@/pages/messages/services/mail.service';
import { RouterModule, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoadingService } from '@/services/loading/loading.service';
import { Message } from '@/pages/messages/models/message';
import { MailToolbar } from '@/pages/messages/components/mail-toolbar/mail-toolbar';
import { Attachment } from '@/pages/messages/models/attachment';
import { DialogModule } from 'primeng/dialog';
import { FileDownloadsOverlay } from '@/pages/common/components/attachments-overlay/file-downloads-overlay.component';

@Component({
  selector: 'app-sent',
  imports: [CommonModule, AvatarModule, BadgeModule, ButtonModule, InputTextModule, ProgressSpinnerModule, TableModule, TagModule, RouterModule, MailToolbar, DialogModule, FileDownloadsOverlay],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sent.html',
  styleUrl: './sent.scss',
})
export class Sent {
  private mailService = inject(MailService);
  router = inject(Router);
  loadingService = inject(LoadingService);
  deletingId = signal<number | null>(null);
  messages$ = this.mailService.getSent();
  searchTerm = signal('');
  filteredMessages = signal<Message[]>([]);
  attachmentList = signal<Attachment[]>([]);
  attachmentsDialogOpen = signal(false);

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

  deleteMessage(id: number) {
    if (this.deletingId() === id) {
      return;
    }
    this.deletingId.set(id);
    this.mailService
      .deleteSentMessage(id)
      .pipe(
        finalize(() => this.deletingId.set(null))
      )
      .subscribe();
  }
}
