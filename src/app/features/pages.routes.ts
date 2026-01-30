import { Routes } from '@angular/router';
import { Dashboard } from '@/features/dashboard/dashboard.component';

export default [
    { path: '', component: Dashboard, pathMatch: 'full' },
    { path: 'messages', loadChildren: () => import('@/features/messages/messages.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

