import { Routes } from '@angular/router';
import { Dashboard } from '@/pages/dashboard/dashboard';

export default [
    { path: '', component: Dashboard },
    { path: 'messages', loadChildren: () => import('@/pages/messages/messages.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
