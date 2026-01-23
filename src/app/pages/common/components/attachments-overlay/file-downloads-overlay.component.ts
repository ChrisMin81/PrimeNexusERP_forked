import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-attachments-overlay',
    standalone: true,
    imports: [CommonModule, DialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './file-downloads-overlay.component.html',
    styleUrl: './file-downloads-overlay.component.scss'
})
export class FileDownloadsOverlay {
    files = input<Array<{ id: number; name: string, size: number, type: string }>>([]);
    visible = input(false);
    header = input('Attachments');
    close = output<void>();
}
