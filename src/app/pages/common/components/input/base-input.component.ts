import { Component, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-base-input',
    standalone: true,
    imports: [CommonModule, InputTextModule, FormsModule],
    template: `
        <div class="input-wrapper" [class.has-clear]="clearable() && !!value()">
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

            @if (clearable() && !!value()) {
                <button
                    type="button"
                    class="clear-button"
                    (click)="clearValue()"
                    [attr.aria-label]="clearAriaLabel()"
                >
                    <span class="pi pi-times" aria-hidden="true"></span>
                </button>
            }
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }

            .input-wrapper {
                position: relative;
                width: 100%;
            }

            .clear-button {
                position: absolute;
                top: 50%;
                right: 0.5rem;
                transform: translateY(-50%);
                border: none;
                background: transparent;
                width: 2.25rem;
                height: 2.25rem;
                border-radius: 9999px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: var(--p-surface-500);
                cursor: pointer;
                transition: color 0.15s ease, background-color 0.15s ease;
            }

            .clear-button:hover,
            .clear-button:focus-visible {
                color: var(--p-surface-900);
                background: var(--p-surface-100);
                outline: none;
            }

            .input-wrapper.has-clear input {
                padding-right: 2.75rem;
            }
        `
    ],
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
    clearable = input<boolean>(false);
    clearAriaLabel = input<string>('Clear input');

    // Custom Events
    onBlur = output<FocusEvent>();
    onFocus = output<FocusEvent>();
    cleared = output<void>();

    clearValue() {
        this.value.set('');
        this.cleared.emit();
    }
}
