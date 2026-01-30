import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { MenuModelService } from '@/layout/service/menu-model.service';
import { MailService } from '@/pages/messages/services/mail.service';
import { Message } from 'api';
import { FloatLabelInput } from '@/pages/common/components/input/float-label-input/float-label-input.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GlobalHotkeyService } from '@/pages/common/services/global-hotkey.service';

type SearchResultType = 'menu' | 'message';

interface SearchResult {
    id: string;
    label: string;
    description?: string;
    route: any[];
    type: SearchResultType;
    badge?: string;
}

@Component({
    selector: 'app-global-search',
    imports: [CommonModule, RouterModule, TagModule, FloatLabelInput],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './global-search.component.html',
    styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent {
    private menuModel = inject(MenuModelService);
    private mailService = inject(MailService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private globalHotkeys = inject(GlobalHotkeyService);
    private document = inject(DOCUMENT);

    searchTerm = signal<string>('');
    normalizedTerm = computed(() => this.searchTerm().trim().toLowerCase());
    expanded = signal<boolean>(false);

    private blurTimer: ReturnType<typeof setTimeout> | null = null;
    private idleTimer: ReturnType<typeof setTimeout> | null = null;
    private collapseTimer: ReturnType<typeof setTimeout> | null = null;

    private readonly idleTimeoutMs = 10000;
    private readonly blurCollapseDelayMs = 500;

    private menuItems = computed(() => this.menuModel.getMenuItems());
    private inboxMessages = this.mailService.getInbox();
    private sentMessages = this.mailService.getSent();
    private drafts = this.mailService.getDrafts();

    private flattenedMenuItems = computed(() => this.flattenMenu(this.menuItems()));

    menuResults = computed<SearchResult[]>(() => {
        const term = this.normalizedTerm();
        if (!term) {
            return [];
        }
        return this.flattenedMenuItems()
            .filter((item) => item.label.toLowerCase().includes(term))
            .slice(0, 5)
            .map((item) => ({
                id: `menu-${item.label}-${item.route.join('-')}`,
                label: item.label,
                description: item.parentLabel,
                route: item.route,
                type: 'menu' as const
            }));
    });

    messageResults = computed<SearchResult[]>(() => {
        const term = this.normalizedTerm();
        if (!term) {
            return [];
        }
        const sources: Array<{ box: string; messages: Message[] | undefined }> = [
            { box: 'inbox', messages: this.inboxMessages() },
            { box: 'sent', messages: this.sentMessages() },
            { box: 'drafts', messages: this.drafts() }
        ];
        const matches: SearchResult[] = [];
        sources.forEach(({ box, messages }) => {
            (messages ?? [])
                .filter((message) => this.messageMatches(message, term))
                .slice(0, 5)
                .forEach((message) =>
                    matches.push({
                        id: `${box}-${message.auditUuid}`,
                        label: message.subject!,
                        description: `${message.senderAddress} • ${this.formatTimestamp(message.messageDate)}`,
                        route: ['/pages/messages', box, message.auditUuid],
                        type: 'message',
                        badge: box
                    })
                );
        });
        return matches;
    });

    groupedResults = computed(() => {
        const groups: Array<{ label: string; items: SearchResult[] }> = [];
        if (this.menuResults().length) {
            groups.push({ label: 'Navigation', items: this.menuResults() });
        }
        if (this.messageResults().length) {
            groups.push({ label: 'Messages', items: this.messageResults() });
        }
        return groups;
    });

    hasQuery = computed(() => this.normalizedTerm().length > 0);
    hasResults = computed(() => this.groupedResults().some((group) => group.items.length > 0));

    onSearchChange(term: string | null | undefined) {
        if (!!term) {
            this.searchTerm.set(term);
        } else {
            this.searchTerm.set('');
        }
        this.resetIdleTimer();
    }

    navigateTo(result: SearchResult) {
        this.router.navigate(result.route);
        this.searchTerm.set('');
        this.expanded.set(false);
        this.clearIdleTimer();
        this.clearCollapseTimer();
    }

    constructor() {
        this.globalHotkeys.ctrlF$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.searchTerm.set('');
            this.toggleSearch();
        });
    }

    toggleSearch() {
        if (this.expanded()) {
            this.collapseSearch();
        } else {
            this.openSearch();
        }
    }

    openSearch() {
        this.expanded.set(true);
        this.resetIdleTimer();
        queueMicrotask(() => this.focusSearchInput());
    }

    handleFocus() {
        this.clearBlurTimer();
        this.expanded.set(true);
        this.resetIdleTimer();
    }

    handleBlur() {
        this.clearBlurTimer();
        this.clearIdleTimer();
        this.scheduleCollapse(this.blurCollapseDelayMs);
    }

    onCleared() {
        this.searchTerm.set('');
        this.resetIdleTimer();
    }

    collapseSearch() {
        this.expanded.set(false);
        this.clearIdleTimer();
        this.clearCollapseTimer();
    }

    private focusSearchInput() {
        const inputEl = this.document.querySelector('input#global-search-input') as HTMLInputElement | null;
        if (inputEl) {
            inputEl.focus();
            inputEl.select();
        }
    }

    private clearBlurTimer() {
        if (this.blurTimer) {
            clearTimeout(this.blurTimer);
            this.blurTimer = null;
        }
    }

    private clearIdleTimer() {
        if (this.idleTimer) {
            clearTimeout(this.idleTimer);
            this.idleTimer = null;
        }
    }

    private clearCollapseTimer() {
        if (this.collapseTimer) {
            clearTimeout(this.collapseTimer);
            this.collapseTimer = null;
        }
    }

    private resetIdleTimer() {
        this.clearIdleTimer();
        if (!this.expanded()) {
            return;
        }
        this.idleTimer = setTimeout(() => {
            this.expanded.set(false);
        }, this.idleTimeoutMs);
    }

    private scheduleCollapse(delay: number) {
        this.clearCollapseTimer();
        this.collapseTimer = setTimeout(() => {
            this.expanded.set(false);
        }, delay);
    }

    private flattenMenu(menu: MenuItem[], parentLabel?: string): Array<{ label: string; route: any[]; parentLabel?: string }> {
        const result: Array<{ label: string; route: any[]; parentLabel?: string }> = [];
        menu.forEach((item) => {
            const currentRoute = this.normalizeRoute(item.routerLink);
            if (currentRoute.length) {
                result.push({ label: item.label ?? '', route: currentRoute, parentLabel });
            }
            if (item.items?.length) {
                result.push(...this.flattenMenu(item.items, item.label ?? parentLabel));
            }
        });
        return result;
    }

    private normalizeRoute(route: MenuItem['routerLink']): any[] {
        if (!route) {
            return [];
        }
        return Array.isArray(route) ? route : [route];
    }

    private messageMatches(message: Message, term: string) {
        const haystack = `${message.subject} ${message.senderAddress} ${message.recipientName} ${message.body}`.toLowerCase();
        return haystack.includes(term);
    }

    private formatTimestamp(value: Date | string | undefined) {
        if(!value) {
            return null
        }
        if (value instanceof Date) {
            return value.toLocaleString();
        }
        return new Date(value).toLocaleString();
    }
}

