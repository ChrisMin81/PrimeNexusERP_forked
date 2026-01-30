import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/component/app-layout/app-layout.component';
import { Dashboard } from '@/pages/dashboard/dashboard.component';
import { Notfound } from '@/pages/notfound/notfound.component';
import { authGuard, authMatchGuard } from '@/pages/auth/auth-guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canMatch: [authMatchGuard],
        canActivateChild: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: Dashboard },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: 'notfound' }
];

