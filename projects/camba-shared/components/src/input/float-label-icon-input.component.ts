import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { extractPrimeIconClass } from 'camba-shared/utils';

@Component({
    selector: 'app-float-label-icon-input',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, FloatLabelModule, IconFieldModule, InputIconModule],
    template: `
        <div class="flex flex-col w-full mb-6" [attr.data-disabled]="disabled()">
            <div class="relative w-full" [class.has-clear]="clearable() && !!value()">
                @if (isFloatLabelShown()) {
                    <p-floatLabel [variant]="$any(variant())">
                        <ng-container *ngTemplateOutlet="contentStructure"></ng-container>
                        <ng-container *ngTemplateOutlet="labelRef"></ng-container>
                    </p-floatLabel>
                } @else {
                    @if (label()) {
                        <div class="mb-1 ml-1">
                            <ng-container *ngTemplateOutlet="labelRef"></ng-container>
                        </div>
                    }
                    <ng-container *ngTemplateOutlet="contentStructure"></ng-container>
                }
            </div>

            <ng-template #labelRef>
                <label
                    [for]="id()"
                    class="text-sm transition-colors text-[var(--flux-label-color,#475569)]
                      data-[disabled=true]:text-[var(--flux-disabled-text,#94a3b8)]"
                >
                    {{ label() }}
                </label>
            </ng-template>

            <ng-template #contentStructure>
                @if (hasIcon()) {
                    <p-iconfield>
                        @if (iconPosition() === 'left' || clearable()) {
                            <p-inputicon [class]="iconClass()" />
                        }
                        <ng-container *ngTemplateOutlet="inputRef"></ng-container>
                        @if (iconPosition() === 'right' && !clearable()) {
                            <p-inputicon [class]="iconClass()" />
                        }
                        @if (clearable() && !!value()) {
                            <p-inputicon class="pi pi-times" (click)="clearValue()"
                                         [attr.aria-label]="clearAriaLabel()" />
                        }
                    </p-iconfield>
                } @else {
                    <ng-container *ngTemplateOutlet="inputRef"></ng-container>
                }
            </ng-template>

            <ng-template #inputRef>
                <input
                    pInputText
                    [id]="id()"
                    [type]="type()"
                    [attr.placeholder]="effectivePlaceholder()"
                    [(ngModel)]="value"
                    [disabled]="disabled()"
                    [autocomplete]="autocomplete()"
                    (blur)="blurred.emit($event)"
                    (focus)="focused.emit($event)"
                    (input)="handleInput($event)"
                    [class.p-inputtext-sm]="size() === 'small'"
                    [class.p-inputtext-lg]="size() === 'large'"
                    class="w-full p-3 transition-all outline-hidden
                rounded-[var(--flux-radius,8px)]
                bg-[var(--flux-bg-color,white)]
                text-[var(--flux-text-color,inherit)]
                border-[var(--flux-border-color,#cbd5e1)]
                focus:ring-2
                focus:ring-[var(--flux-primary-color,#3b82f6)]
                focus:border-[var(--flux-primary-color,#3b82f6)]
                disabled:bg-[var(--flux-disabled-bg,#f1f5f9)]
                disabled:border-[var(--flux-disabled-border,#e2e8f0)]
                disabled:cursor-not-allowed
                disabled:opacity-70"
                />
            </ng-template>
            @if (hint()) {
                <small
                    class="text-sm mt-1 ml-1 italic transition-colors
                       text-[var(--flux-hint-color,#64748b)]
                       data-[disabled=true]:text-[var(--flux-disabled-text,#94a3b8)]"
                >
                    {{ hint() }}
                </small>
            }
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FloatLabelIconInputComponent {
    readonly id = input.required<string>();
    readonly value = model<string>('');
    readonly label = input<string>();
    readonly placeholder = input<string>('');
    readonly variant = input<'in' | 'over' | 'on' | 'none'>('on');
    readonly iconPosition = input<'left' | 'right'>('left');
    readonly icon = input<string>('');
    readonly type = input<'text' | 'password' | 'email' | 'number'>('text');
    readonly hint = input<string>();
    readonly disabled = input<boolean>(false);
    readonly autocomplete = input<'off' | 'on'>('off');
    readonly styleClass = input<string>('');
    readonly styles = input<Record<string, string | number>>({});
    readonly readonly = input<boolean>(false);
    readonly maxlength = input<number | undefined>(undefined);
    readonly size = input<'small' | 'large' | undefined>(undefined);
    readonly inputVariant = input<'filled' | 'outlined'>('outlined');
    readonly clearable = input<boolean>(false);
    readonly clearAriaLabel = input<string>('Clear input');

    // Custom Events
    readonly valueChange = output<string>();
    readonly blurred = output<FocusEvent>();
    readonly focused = output<FocusEvent>();
    readonly cleared = output<void>();

    /**
     * Determines if the PrimeNG FloatLabel wrapper should be active.
     * Logic: A label must exist, and the variant must not be 'none'.
     */
    readonly isFloatLabelShown = computed(() => !!this.label() && this.variant() !== 'none');

    /**
     * Note: PrimeNG FloatLabels "jump" to the active state if a placeholder attribute is present.
     * To allow placeholders only when NO label is shown, we return null to remove the attribute
     * from the DOM entirely, ensuring the label stays in its resting position.
     */
    readonly effectivePlaceholder = computed(() => {
        return this.isFloatLabelShown() ? null : this.placeholder() || null;
    });

    readonly hasIcon = computed(() => !!this.icon()?.trim());

    /**
     * Note: Normalizes the icon string to ensure it follows the 'pi pi-name' format.
     * Developers might pass 'pencil', 'pi-pencil', or 'pi pi-pencil'.
     * This logic prevents duplicate prefixes like 'pi-pi-' or 'pi pi pi-'.
     */
    readonly iconClass = computed(() => extractPrimeIconClass(this.icon()));
    handleInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.valueChange.emit(target.value);
    }

    clearValue() {
        this.value.set('');
        this.cleared.emit();
    }
}
