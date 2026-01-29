import { inject, Injectable, Injector, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, of, take, tap, throwError } from 'rxjs';
import { LoggerService } from '@/services/logger/logger';
import { LoadingService } from '@/services/loading/loading.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Message } from '@/api/models/message';
import { MessageAttachment } from '@/api/models/message-attachment';

@Injectable({ providedIn: 'root' })
export class MailService {
    private http = inject(HttpClient);
    private logger = inject(LoggerService);
    private loadingService = inject(LoadingService);
    private injector = inject(Injector);
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

    sendMail(payload: SendMailPayload): Signal<Message | undefined> {
        const recipientName = payload.recipientName ?? payload.recipients.join(', ');
        const { recipients, ...rest } = payload;
        const apiPayload = { ...rest, recipientName };
        return toSignal(
            this.loadingService.showLoaderUntilCompleted(this.http.post<Message>('/api/messages/send', apiPayload)).pipe(
                take(1),
                tap((message) => {
                    const current = this.sentSignal() ?? [];
                    this.sentSignal.set([message, ...current]);
                    this.sentLoaded = true;
                    this.logger.trace('Sent message created:', message);
                    if (payload.auditUuid) {
                        const drafts = this.draftsSignal() ?? [];
                        this.draftsSignal.set(drafts.filter((draft) => draft.auditUuid !== payload.auditUuid));
                    }
                })
            ),
            { injector: this.injector }
        );
    }

    deleteInboxMessage(idToDelete: WritableSignal<string | null>) {
        return this.deleteMessage('inbox', idToDelete);
    }

    deleteSentMessage(id: WritableSignal<string | null>) {
        return this.deleteMessage('sent', id);
    }

    deleteMessage(box: Mailbox, idToDelete: WritableSignal<string | null>) {
        const id = idToDelete();
        return toSignal(
            this.loadingService.showLoaderUntilCompleted(this.http.delete<void>(`/api/messages/${box}/${id}`)).pipe(
                catchError((err) => {
                    this.logger.trace(`Failed to delete ${box} message`, err);
                    return throwError(() => err);
                }),
                take(1),
                tap(() => {
                    const mailBox = this.getMessages(box);
                    const current = mailBox() ?? [];
                    mailBox.set(current.filter((message) => message.auditUuid !== id));
                    this.logger.trace(`Deleted ${box} message: ${id}`);
                }),
                finalize(() => idToDelete.set(null))
            ),
            { injector: this.injector, initialValue: null }
        );
    }

    private getMessages(box: Mailbox) {
        switch (box) {
            case 'inbox':
                return this.inboxSignal;
            case 'sent':
                return this.sentSignal;
            case 'drafts':
                return this.draftsSignal;
        }
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

    markInboxAsRead(id: string) {
        const current = this.inboxSignal();
        if (!current) {
            return;
        }
        this.inboxSignal.set(
            current.map((message) => {
                if (message.auditUuid !== id) {
                    return message;
                }
                if (message.readDate) {
                    return message;
                }
                return {
                    ...message,
                    readDate: new Date().toISOString()
                };
            })
        );
    }

    getMessage(box: Mailbox, id: string): Message | undefined {
        const source = this.pickMailbox(box)();
        return source?.find((message) => message.auditUuid === id);
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
    recipientName?: string;
    attachments?: MessageAttachment[];
    auditUuid: string;
}

export type Mailbox = 'inbox' | 'sent' | 'drafts';
