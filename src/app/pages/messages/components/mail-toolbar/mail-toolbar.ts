import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { SearchInput } from '@/pages/common/components/search-input/search-input';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-mail-toolbar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, BadgeModule, ButtonModule, SearchInput, ProgressSpinnerModule],
    templateUrl: './mail-toolbar.html',
    styleUrl: './mail-toolbar.scss'
})
export class MailToolbar {
    title = input<string>('Mail');
    subtitle = input<string | null>(null);
    count = input<number>(0);
    searchPlaceholder = input<string>('Search');
    searchLabel = input<string>('Search');
    loading = input<boolean>(false);
    showCompose = input<boolean>(true);
    autocomplete   = input<'off' | 'on'>('off');

    refresh = output<void>();
    compose = output<void>();
    searchChange = output<string>();
}
