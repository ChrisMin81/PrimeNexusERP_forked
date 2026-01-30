import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import type { ButtonSeverity } from 'primeng/types/button';

@Component({
    selector: 'app-confirm-dialog',
    imports: [CommonModule, DialogModule, ButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialog {
    visible = input(false);
    header = input('Confirm Action');
    message = input('Are you sure you want to continue?');
    confirmLabel = input('Confirm');
    cancelLabel = input('Cancel');
    confirmSeverity = input<ButtonSeverity>('danger');
    confirmLoading = input(false);
    dismissible = input(true);

    confirm = output<void>();
    dismissed = output<void>();

    onHide() {
        this.dismissed.emit();
    }

    onCancelClick() {
        this.dismissed.emit();
    }

    onConfirmClick() {
        this.confirm.emit();
    }
}
