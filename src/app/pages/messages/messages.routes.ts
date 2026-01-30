import { Routes } from '@angular/router';
import { MessagesPage } from '@/pages/messages/messages.page.component';
import { Inbox } from '@/pages/messages/inbox/inbox.component';
import { Sent } from '@/pages/messages/sent/sent.component';
import { Compose } from '@/pages/messages/compose/compose.component';
import { Drafts } from '@/pages/messages/drafts/drafts.component';
import { MessageDetail } from '@/pages/messages/message-detail/message-detail.component';

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

