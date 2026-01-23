import { Component, inject, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/pages/auth/auth-service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    private authService = inject(AuthService);

    ngOnInit() {
        this.model = [
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
                        visible: !this.authService.isAuthenticated()
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/logout'],
                        visible: this.authService.isAuthenticated()
                    }
                ]
            }
        ];
    }
}
