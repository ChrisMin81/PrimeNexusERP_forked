import { Routes } from '@angular/router';
import { Dashboard } from '@/pages/dashboard/dashboard.component';

export default [
    { path: '', component: Dashboard, pathMatch: 'full' },
    { path: 'messages', loadChildren: () => import('@/pages/messages/messages.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

