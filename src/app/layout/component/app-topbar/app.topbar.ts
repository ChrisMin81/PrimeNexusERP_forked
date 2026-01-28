import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuItem } from 'primeng/api';
import { layoutConfig, LayoutService } from '@/layout/service/layout.service';
import { BadgeModule } from 'primeng/badge';
import { MailService } from '@/pages/messages/services/mail.service';
import { AppConfigurator } from '@/layout/component/app-configurator/app.configurator';
import { GlobalSearchComponent } from '@/pages/common/components/global-search/global-search.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, CommonModule, StyleClassModule, BadgeModule, AppConfigurator, GlobalSearchComponent],
    templateUrl: './app.topbar.html',
    styleUrl: './app.topbar.scss'
})
export class AppTopbar {
    items!: MenuItem[];
    private mailService = inject(MailService);
    private inboxMessages = this.mailService.getInbox();
    unreadCount = computed(() => (this.inboxMessages() ?? []).filter((message) => !message.isRead).length);

    constructor(public layoutService: LayoutService) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state: layoutConfig) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
