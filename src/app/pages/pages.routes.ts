import { Routes } from '@angular/router';
import { Empty } from './empty/empty';
import { Dashboard } from '@/pages/dashboard/dashboard';

export default [
    { path: '', component: Dashboard },
    { path: 'messages', loadChildren: () => import('@/pages/messages/messages.module').then(m => m.MessagesModule) },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
