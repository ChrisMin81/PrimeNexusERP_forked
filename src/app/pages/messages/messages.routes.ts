import { Routes } from '@angular/router';
import { MessagesPage } from '@/pages/messages/messages.page';
import { Inbox } from '@/pages/messages/inbox/inbox';
import { Sent } from '@/pages/messages/sent/sent';
import { Compose } from '@/pages/messages/compose/compose';
import { Drafts } from '@/pages/messages/drafts/drafts';
import { MessageDetail } from '@/pages/messages/message-detail/message-detail';

export const MESSAGES_ROUTES: Routes = [
    { path: '', component: MessagesPage },
    { path: 'inbox', component: Inbox },
    { path: 'inbox/:id', component: MessageDetail, data: { box: 'inbox' } },
    { path: 'compose', component: Compose },
    { path: 'sent', component: Sent },
    { path: 'sent/:id', component: MessageDetail, data: { box: 'sent' } },
    { path: 'drafts', component: Drafts },
    { path: 'drafts/:id', component: MessageDetail, data: { box: 'drafts' } },
    { path: '**', redirectTo: '/notfound' }
];

export default MESSAGES_ROUTES;
