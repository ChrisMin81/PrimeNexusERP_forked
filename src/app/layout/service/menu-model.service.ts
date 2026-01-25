import { inject, Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from '@/pages/auth/auth-service';

@Injectable({ providedIn: 'root' })
export class MenuModelService {
    private authService = inject(AuthService);

    getMenuItems(): MenuItem[] {
        const isAuthenticated = this.authService.isAuthenticated();
        return [
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] }]
            },
            {
                label: 'Messages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['messages'],
                items: [
                    {
                        label: 'Compose',
                        icon: 'pi pi-fw pi-inbox',
                        routerLink: ['pages', 'messages', 'compose']
                    },
                    {
                        label: 'Inbox',
                        icon: 'pi pi-fw pi-inbox',
                        routerLink: ['pages', 'messages', 'inbox']
                    },
                    {
                        label: 'Drafts',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['pages', 'messages', 'drafts']
                    },
                    {
                        label: 'Sent',
                        icon: 'pi pi-fw pi-send',
                        routerLink: ['pages', 'messages', 'sent']
                    }
                ],
                expanded: true
            },
            {
                label: 'Auth',
                icon: 'pi pi-fw pi-user',
                items: [
                    {
                        label: 'Login',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/login'],
                        visible: !isAuthenticated
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/logout'],
                        visible: isAuthenticated
                    }
                ]
            }
        ];
    }
}
