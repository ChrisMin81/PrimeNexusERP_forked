import { Routes } from '@angular/router';
import { Dashboard } from '@/features/dashboard/dashboard.component';
import { Empty } from '@/features/empty/empty.component';

export default [
    { path: '', component: Dashboard, pathMatch: 'full' },
    { path: 'empty', component: Empty },
    { path: 'messages', loadChildren: () => import('@/features/messages/messages.routes') },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

