import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { Message } from '@/api/models/message';

export type MessageTableContext = 'inbox' | 'sent' | 'drafts';

@Component({
    selector: 'app-message-table',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TableModule, AvatarModule, TagModule, ButtonModule],
    template: `
        <p-table
            [value]="messages() ?? []"
            dataKey="auditUuid"
            [rowHover]="true"
            aria-label="Messages"
            class="w-full"
        >
            <ng-template pTemplate="header">
                <tr>
                    @if (hasAvatar()) {
                        <th class="w-3rem"></th>
                    }
                    <th>{{ primaryHeader() }}</th>
                    <th>Subject</th>
                    <th class="hidden lg:table-cell">Preview</th>
                    <th class="w-8rem text-center">Attachments</th>
                    <th class="w-10rem">{{ timestampHeader() }}</th>
                    <th class="w-12rem text-right">Actions</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-message>
                <tr
                    class="cursor-pointer transition-colors"
                    [class.bg-surface-100]="!message.readDate && context() !== 'drafts'"
                    [class.dark:bg-surface-800]="!message.readDate && context() !== 'drafts'"
                    [class.font-semibold]="!message.readDate && context() !== 'drafts'"
                    (click)="onOpen(message)"
                >
                    @if (hasAvatar()) {
                        <td>
                            <p-avatar [label]="avatarLabel(message)" shape="circle" size="large"></p-avatar>
                        </td>
                    }
                    <td>
                        <div class="font-medium text-surface-900 dark:text-surface-0">{{ primaryValue(message) }}</div>
                        @if (secondaryValue(message); as secondary) {
                            <div class="text-sm text-muted-color">{{ secondary }}</div>
                        }
                    </td>
                    <td>
                        <div class="font-semibold text-surface-900 dark:text-surface-0">
                            {{ message.subject || '(No subject)' }}
                        </div>
                        @if (!message.readDate && context() !== 'drafts') {
                            <p-tag value="New" severity="success" rounded="true" class="mt-1"></p-tag>
                        }
                    </td>
                    <td class="hidden lg:table-cell">
                        <span class="block max-w-64 truncate text-sm text-muted-color">{{ message.body }}</span>
                    </td>
                    <td class="text-center">
                        @if ((message.attachments?.length ?? 0) > 0) {
                            <p-tag
                                [value]="message.attachments?.length"
                                severity="info"
                                icon="pi pi-paperclip"
                                (click)="onAttachments($event, message)"
                            ></p-tag>
                        } @else {
                            <span class="text-muted-color">-</span>
                        }
                    </td>
                    <td>
                        <div class="text-sm text-muted-color">
                            {{ message.messageDate | date: 'MMM d, y, h:mm a' }}
                        </div>
                    </td>
                    <td class="text-right">
                        <div class="flex justify-end gap-2">
                            @if (context() === 'inbox') {
                                <button
                                    pButton
                                    type="button"
                                    severity="secondary"
                                    [text]="true"
                                    aria-label="Reply"
                                    (click)="onReply($event, message)"
                                >
                                    <span pButtonIcon class="pi pi-reply"></span>
                                </button>
                                <button
                                    pButton
                                    type="button"
                                    severity="danger"
                                    [text]="true"
                                    [loading]="isDeleting(message)"
                                    aria-label="Delete"
                                    (click)="onDelete($event, message)"
                                >
                                    <span pButtonIcon class="pi pi-trash"></span>
                                </button>
                                <button
                                    pButton
                                    type="button"
                                    severity="secondary"
                                    [text]="true"
                                    aria-label="Open"
                                    (click)="onOpen(message); $event.stopPropagation()"
                                >
                                    <span pButtonIcon class="pi pi-chevron-right"></span>
                                </button>
                            } @else if (context() === 'sent') {
                                <button
                                    pButton
                                    type="button"
                                    severity="danger"
                                    [text]="true"
                                    [loading]="isDeleting(message)"
                                    aria-label="Delete"
                                    (click)="onDelete($event, message)"
                                >
                                    <span pButtonIcon class="pi pi-trash"></span>
                                </button>
                                <button
                                    pButton
                                    type="button"
                                    severity="secondary"
                                    [text]="true"
                                    aria-label="Open"
                                    (click)="onOpen(message); $event.stopPropagation()"
                                >
                                    <span pButtonIcon class="pi pi-chevron-right"></span>
                                </button>
                            } @else {
                                <button
                                    pButton
                                    type="button"
                                    severity="primary"
                                    [text]="true"
                                    aria-label="Edit"
                                    (click)="onEditDraft($event, message)"
                                >
                                    <span pButtonIcon class="pi pi-pencil"></span>
                                </button>
                                <button
                                    pButton
                                    type="button"
                                    severity="secondary"
                                    [text]="true"
                                    aria-label="Send"
                                    (click)="onSendDraft($event, message)"
                                >
                                    <span pButtonIcon class="pi pi-send"></span>
                                </button>
                            }
                        </div>
                    </td>
                </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
                <tr>
                    <td [attr.colspan]="hasAvatar() ? 7 : 6">
                        <div class="flex flex-col items-center justify-center py-8 text-muted-color">
                            <i [attr.class]="emptyIconClass()"></i>
                            <span>{{ emptyLabel() }}</span>
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `
})
export class MessageTableComponent {
    messages = input<Message[] | null>(null);
    context = input<MessageTableContext>('inbox');
    loadingDeleteId = input<string | null>(null);
    emptyIcon = input<string>('pi pi-inbox');
    emptyLabel = input<string>('No messages found.');

    open = output<Message>();
    reply = output<Message>();
    delete = output<Message>();
    attachments = output<{ originalEvent: Event; message: Message }>();
    editDraft = output<Message>();
    sendDraft = output<Message>();

    private headers: Record<MessageTableContext, { primary: string; timestamp: string }> = {
        inbox: { primary: 'Sender', timestamp: 'Received' },
        sent: { primary: 'To', timestamp: 'Sent' },
        drafts: { primary: 'To', timestamp: 'Updated' }
    };

    hasAvatar = computed(() => this.context() !== 'drafts');
    primaryHeader = computed(() => this.headers[this.context()].primary);
    timestampHeader = computed(() => this.headers[this.context()].timestamp);
    emptyIconClass = computed(() => `text-2xl mb-3 ${this.emptyIcon()}`);

    avatarLabel(message: Message) {
        if (this.context() === 'inbox') {
            return (message.senderAddress ?? message.senderName ?? 'U')[0] ?? 'U';
        }
        const recipient = message.recipientName ?? 'U';
        return recipient[0] ?? 'U';
    }

    primaryValue(message: Message) {
        if (this.context() === 'inbox') {
            return message.senderAddress ?? message.senderName ?? 'Unknown sender';
        }
        return message.recipientName ?? 'Unknown recipient';
    }

    secondaryValue(message: Message) {
        if (this.context() === 'inbox') {
            return message.recipientName ?? null;
        }
        if (this.context() === 'sent') {
            return message.senderAddress ?? message.senderName ?? null;
        }
        return message.recipientName ?? null;
    }

    isDeleting(message: Message) {
        const currentId = this.loadingDeleteId();
        return !!currentId && currentId === message.auditUuid;
    }

    onOpen(message: Message) {
        this.open.emit(message);
    }

    onReply(event: Event, message: Message) {
        event.stopPropagation();
        this.reply.emit(message);
    }

    onDelete(event: Event, message: Message) {
        event.stopPropagation();
        this.delete.emit(message);
    }

    onAttachments(event: Event, message: Message) {
        event.stopPropagation();
        this.attachments.emit({ originalEvent: event, message });
    }

    onEditDraft(event: Event, message: Message) {
        event.stopPropagation();
        this.editDraft.emit(message);
    }

    onSendDraft(event: Event, message: Message) {
        event.stopPropagation();
        this.sendDraft.emit(message);
    }
}
