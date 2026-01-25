import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelInput } from '@/pages/common/components/input/float-label-input/float-label-input';

@Component({
    selector: 'app-search-input',
    imports: [CommonModule, InputTextModule, FloatLabelInput],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './search-input.html',
    styleUrl: './search-input.scss'
})
export class SearchInput {
    value = input<string>('');
    label = input<string>('Search');
    ariaLabel = input<string>('Search');
    autocomplete = input<'off' | 'on'>('off');
    valueChange = output<string>();

    onInput(event: Event) {
        const val = (event.target as HTMLInputElement | null)?.value ?? '';
        this.valueChange.emit(val);
    }
}
