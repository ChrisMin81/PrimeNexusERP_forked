import { Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-base-input',
    standalone: true,
    imports: [CommonModule, InputTextModule, FormsModule],
    template: `
        <input
            pInputText
            [id]="id()"
            [type]="type()"
            [disabled]="disabled()"
            [readonly]="readonly()"
            [attr.maxlength]="maxlength() ?? null"
            [ngClass]="styleClass()"
            [ngStyle]="styles()"
            [(ngModel)]="value"
            (blur)="onBlur.emit($event)"
            (focus)="onFocus.emit($event)"
            [class.p-inputtext-sm]="size() === 'small'"
            [class.p-inputtext-lg]="size() === 'large'"
            [autocomplete]="autocomplete()"
            [attr.placeholder]="placeholder() ?? null"
            [attr.variant]="variant()"
        />
    `,
    host: {
        'aria-label': 'ariaLabel() ?? null',
    }
})
export class BaseInputComponent {
    // Signal Model for bidirectional binding ([(value)])
    value = model<string | null>(null);

    // Signal Inputs (Read-only within the component)
    placeholder = input<string | null | undefined>(undefined);
    autocomplete = input<'off' | 'on'>('on');
    type = input<string>('text');
    id = input<string | undefined>(undefined);
    styleClass = input<string>('');
    styles = input<{ [klass: string]: any }>({});
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    maxlength = input<number | undefined>(undefined);
    size = input<'small' | 'large' | undefined>(undefined);
    variant = input<'filled' | 'outlined'>('outlined');

    // Custom Events
    onBlur = output<FocusEvent>();
    onFocus = output<FocusEvent>();
}
