import { Routes } from '@angular/router';
import { MessagesPage } from '@/features/messages/messages.page.component';
import { Inbox } from '@/features/messages/inbox/inbox.component';
import { Sent } from '@/features/messages/sent/sent.component';
import { Compose } from '@/features/messages/compose/compose.component';
import { Drafts } from '@/features/messages/drafts/drafts.component';
import { MessageDetail } from '@/features/messages/message-detail/message-detail.component';

export const MESSAGES_ROUTES: Routes = [
    { path: '', component: MessagesPage, pathMatch: 'full' },
    { path: 'inbox/:id', component: MessageDetail, data: { box: 'inbox' } },
    { path: 'inbox', component: Inbox, pathMatch: 'full' },
    { path: 'compose', component: Compose, pathMatch: 'full' },
    { path: 'sent/:id', component: MessageDetail, data: { box: 'sent' } },
    { path: 'sent', component: Sent, pathMatch: 'full' },
    { path: 'drafts/:id', component: MessageDetail, data: { box: 'drafts' } },
    { path: 'drafts', component: Drafts, pathMatch: 'full' },
    { path: '**', redirectTo: '/notfound' }
];

export default MESSAGES_ROUTES;

