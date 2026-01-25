import { Component, input, contentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatLabelModule } from 'primeng/floatlabel';
import { BaseInputComponent } from '../base-input.component';

@Component({
    selector: 'app-float-label',
    standalone: true,
    imports: [CommonModule, FloatLabelModule],
    template: `
        <p-floatlabel [variant]="variant()" [ngClass]="styleClass()">
            <ng-content></ng-content>
            <label [for]="labelFor()">{{ label() }}</label>
        </p-floatlabel>
    `
})
export class FloatLabelComponent {
    label = input.required<string>();

    // Label animation variant:
    // 'over' = above the field, 'on' = on the border, 'in' = inside the field
    variant = input<'over' | 'on' | 'in'>('on');
    forId = input<string | undefined>(undefined);
    styleClass = input<string>('');

    // Manual ID or automatic detection from child component
    private contentInput = contentChild(BaseInputComponent);

    // Resolves the ID to link the label with the input
    labelFor(): string {
        return this.forId() || this.contentInput()?.id() || '';
    }
}
