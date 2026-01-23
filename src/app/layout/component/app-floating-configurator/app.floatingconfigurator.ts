import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '@/layout/component/app-configurator/app.configurator';
import { LayoutService, layoutConfig } from '@/layout/service/layout.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-floating-configurator',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ButtonModule, StyleClassModule, AppConfigurator],
    templateUrl: './app.floatingconfigurator.html',
    styleUrl: './app.floatingconfigurator.scss'
})
export class AppFloatingConfigurator {
    private layoutService = inject(LayoutService);

    float = input<boolean>(true);

    isDarkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state: layoutConfig) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
