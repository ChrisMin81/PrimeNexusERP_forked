import { Component, computed, input, model, output } from '@angular/core';
import { BaseInputComponent } from '@/pages/common/components/input/base-input.component';
import { FloatLabelComponent } from '@/pages/common/components/input/float-label/float-label.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-float-label-input',
    imports: [BaseInputComponent, FloatLabelComponent, FormsModule],
    template: `
        <app-float-label [label]="label()" [forId]="id()" [styleClass]="styleClass()" [variant]="variant()">
            <app-base-input
                styleClass="w-full"
                [id]="id()"
                [type]="type()"
                [disabled]="disabled()"
                [readonly]="readonly()"
                [attr.maxlength]="maxlength() ?? null"
                [attr.placeholder]="placeholder() ?? null"
                [attr.variant]="inputVariant()"
                [autocomplete]="autocomplete()"
                [(value)]="value"
                (blur)="onBlur.emit($event)"
                (focus)="onFocus.emit($event)"
                [class.p-inputtext-sm]="size() === 'small'"
                [class.p-inputtext-lg]="size() === 'large'"
            />
        </app-float-label>
    `
})
export class FloatLabelInput {
    label = input.required<string>();
    // Signal Model for bidirectional binding ([(value)])
    value = model<string | null>(null);

    // Signal Inputs (Read-only within the component)
    placeholder = input<string | null | undefined>(undefined);
    autocomplete = input<'off' | 'on'>('off');
    type = input<string>('text');
    id = input<string | undefined>(undefined);
    styleClass = input<string>('');
    styles = input<{ [klass: string]: any }>({});
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    maxlength = input<number | undefined>(undefined);
    size = input<'small' | 'large' | undefined>(undefined);
    inputVariant = input<'filled' | 'outlined'>('outlined');
    variant = input<'over' | 'on' | 'in'>('on');

    // Custom Events
    onBlur = output<FocusEvent>();
    onFocus = output<FocusEvent>();
}
