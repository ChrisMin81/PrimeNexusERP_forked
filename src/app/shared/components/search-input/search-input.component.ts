import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelIconInputComponent } from 'camba-shared/components';

@Component({
    selector: 'app-search-input',
    imports: [CommonModule, InputTextModule, FloatLabelIconInputComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './search-input.component.html',
    styleUrl: './search-input.component.scss'
})
export class SearchInput {
    value = input<string>('');
    label = input<string>('Search');
    ariaLabel = input<string>('Search');
    autocomplete = input<'off' | 'on'>('off');
    clearable = input<boolean>(true);
    clearAriaLabel = input<string>('Clear search');
    placeholder = input<string>('Search');
    valueChange = output<string>();

    onInput(event: Event) {
        const target = event.target;
        const rawValue = target instanceof HTMLInputElement ? target.value : '';
        this.valueChange.emit(rawValue.trim());
    }

    onCleared() {
        this.valueChange.emit('');
    }
}


