import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-search-input',
    standalone: true,
    imports: [CommonModule, InputTextModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './search-input.html',
    styleUrl: './search-input.scss'
})
export class SearchInput {
    value = input<string>('');
    placeholder = input<string>('Search');
    ariaLabel = input<string>('Search');
    valueChange = output<string>();

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement | null)?.value ?? '';
        this.valueChange.emit(val);
    }
}
