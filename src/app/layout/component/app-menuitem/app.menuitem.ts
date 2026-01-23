import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { LayoutService } from '@/layout/service/layout.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: '[app-menuitem]',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterModule, RippleModule],
    host: {
        '[class.layout-root-menuitem]': 'root()',
        '[class.active-menuitem]': '!root() && active()'
    },
    templateUrl: './app.menuitem.html',
    styleUrl: './app.menuitem.scss'
})
export class AppMenuitem {
    private router = inject(Router);
    private layoutService = inject(LayoutService);
    private destroyRef = inject(DestroyRef);

    readonly item = input.required<MenuItem>();
    readonly index = input.required<number>();
    readonly root = input(false);
    readonly parentKey = input<string>('');

    readonly active = signal(false);
    readonly isVisible = computed(() => this.item().visible !== false);

    readonly key = computed(() => (this.parentKey() ? `${this.parentKey()}-${this.index()}` : String(this.index())));

    constructor() {
        this.layoutService.menuSource$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                queueMicrotask(() => {
                    const currentKey = this.key();
                    if (value.routeEvent) {
                        this.active.set(value.key === currentKey || value.key.startsWith(`${currentKey}-`));
                    } else if (value.key !== currentKey && !value.key.startsWith(`${currentKey}-`)) {
                        this.active.set(false);
                    }
                });
            });

        this.layoutService.resetSource$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.active.set(false));

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(() => {
                if (this.item().routerLink) {
                    this.updateActiveStateFromRoute();
                }
            });
    }

    private updateActiveStateFromRoute() {
        const link = this.item().routerLink;
        if (!link) {
            return;
        }

        const targetLink = Array.isArray(link) ? link[0] : link;
        const activeRoute = this.router.isActive(targetLink, { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });

        if (activeRoute) {
            this.layoutService.onMenuStateChange({ key: this.key(), routeEvent: true });
        }
    }

    itemClick(event: Event) {
        const currentItem = this.item();
        if (currentItem.disabled) {
            event.preventDefault();
            return;
        }

        if (currentItem.command) {
            currentItem.command({ originalEvent: event, item: currentItem });
        }

        if (currentItem.items) {
            this.active.update((previous) => !previous);
        }

        this.layoutService.onMenuStateChange({ key: this.key() });
    }
}
