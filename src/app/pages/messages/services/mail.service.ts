import { inject, Injectable, Signal, signal } from '@angular/core';
import { Message } from '@/pages/messages/models/message';
import { HttpClient } from '@angular/common/http';
import { catchError, of, take, tap } from 'rxjs';
import { LoggerService } from '@/services/logger/logger';
import { Attachment } from '@/pages/messages/models/attachment';
import { LoadingService } from '@/services/loading/loading.service';

@Injectable({ providedIn: 'root' })
export class MailService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);
    private loadingService = inject(LoadingService);
    private inboxSignal = signal<Message[] | undefined>(undefined);
    private sentSignal = signal<Message[] | undefined>(undefined);
    private draftsSignal = signal<Message[] | undefined>(undefined);
    private inboxLoaded = false;
    private sentLoaded = false;
    private draftsLoaded = false;
    private inboxLoading = false;
    private sentLoading = false;
    private draftsLoading = false;

    getInbox(offset = 0, limit = 25): Signal<Message[] | undefined> {
        this.loadInbox(offset, limit);
        return this.inboxSignal.asReadonly();
    }

    getSent(offset = 0, limit = 25): Signal<Message[] | undefined> {
        this.loadSent(offset, limit);
        return this.sentSignal.asReadonly();
    }

    getDrafts(offset = 0, limit = 25): Signal<Message[] | undefined> {
        this.loadDrafts(offset, limit);
        return this.draftsSignal.asReadonly();
    }

    sendMail(payload: SendMailPayload) {
        return this.loadingService.showLoaderUntilCompleted(this.http.post<Message>('/api/messages/send', payload)).pipe(
            take(1),
            tap((message) => {
                const current = this.sentSignal() ?? [];
                this.sentSignal.set([message, ...current]);
                this.sentLoaded = true;
                this.logger.trace('Sent message created:', message);
                if (payload.draftId) {
                    const drafts = this.draftsSignal() ?? [];
                    this.draftsSignal.set(drafts.filter((draft) => draft.id !== payload.draftId));
                }
            })
        );
    }

    deleteInboxMessage(id: number) {
        return this.loadingService.showLoaderUntilCompleted(this.http.delete<void>(`/api/messages/inbox/${id}`)).pipe(
            take(1),
            tap(() => {
                const current = this.inboxSignal() ?? [];
                this.inboxSignal.set(current.filter((message) => message.id !== id));
                this.logger.trace('Deleted inbox message:', id);
            })
        );
    }

    deleteSentMessage(id: number) {
        return this.loadingService.showLoaderUntilCompleted(this.http.delete<void>(`/api/messages/sent/${id}`)).pipe(
            take(1),
            tap(() => {
                const current = this.sentSignal() ?? [];
                this.sentSignal.set(current.filter((message) => message.id !== id));
                this.logger.trace('Deleted sent message:', id);
            })
        );
    }

    refreshInbox(offset = 0, limit = 25) {
        this.inboxLoaded = false;
        this.loadInbox(offset, limit);
    }

    refreshSent(offset = 0, limit = 25) {
        this.sentLoaded = false;
        this.loadSent(offset, limit);
    }

    refreshDrafts(offset = 0, limit = 25) {
        this.draftsLoaded = false;
        this.loadDrafts(offset, limit);
    }

    private loadInbox(offset: number, limit: number) {
        if (this.inboxLoaded || this.inboxLoading) {
            return;
        }
        this.inboxLoading = true;
        this.loadingService
            .showLoaderUntilCompleted(this.http.get<Message[]>('/api/messages/inbox', { params: { offset, limit } }))
            .pipe(
                take(1),
                catchError((error) => {
                    console.error('Error fetching inbox messages:', error);
                    return of([]);
                }),
                tap((res) => this.logger.trace('Inbox messages:', res))
            )
            .subscribe((messages) => {
                this.inboxSignal.set(messages);
                this.inboxLoaded = true;
                this.inboxLoading = false;
            });
    }

    private loadSent(offset: number, limit: number) {
        if (this.sentLoaded || this.sentLoading) {
            return;
        }
        this.sentLoading = true;
        this.loadingService
            .showLoaderUntilCompleted(this.http.get<Message[]>('/api/messages/sent', { params: { offset, limit } }))
            .pipe(
                take(1),
                catchError((error) => {
                    console.error('Error fetching sent messages:', error);
                    return of([]);
                }),
                tap((res) => this.logger.trace('Sent messages:', res))
            )
            .subscribe((messages) => {
                this.sentSignal.set(messages);
                this.sentLoaded = true;
                this.sentLoading = false;
            });
    }

    private loadDrafts(offset: number, limit: number) {
        if (this.draftsLoaded || this.draftsLoading) {
            return;
        }
        this.draftsLoading = true;
        this.loadingService
            .showLoaderUntilCompleted(this.http.get<Message[]>('/api/messages/drafts', { params: { offset, limit } }))
            .pipe(
                take(1),
                catchError((error) => {
                    console.error('Error fetching draft messages:', error);
                    return of([]);
                }),
                tap((res) => this.logger.trace('Draft messages:', res))
            )
            .subscribe((messages) => {
                this.draftsSignal.set(messages);
                this.draftsLoaded = true;
                this.draftsLoading = false;
            });
    }

    markInboxAsRead(id: number) {
        const current = this.inboxSignal();
        if (!current) {
            return;
        }
        this.inboxSignal.set(current.map((message) => (message.id === id ? { ...message, isRead: true } : message)));
    }

    getMessage(box: Mailbox, id: number): Message | undefined {
        const source = this.pickMailbox(box)();
        return source?.find((message) => message.id === id);
    }

    private pickMailbox(box: Mailbox) {
        switch (box) {
            case 'inbox':
                this.loadInbox(0, 25);
                return this.inboxSignal.asReadonly();
            case 'sent':
                this.loadSent(0, 25);
                return this.sentSignal.asReadonly();
            case 'drafts':
                this.loadDrafts(0, 25);
                return this.draftsSignal.asReadonly();
        }
    }
}

export interface SendMailPayload {
    subject: string;
    content: string;
    recipients: string[];
    attachments?: Attachment[];
    draftId?: number;
}

export type Mailbox = 'inbox' | 'sent' | 'drafts';
