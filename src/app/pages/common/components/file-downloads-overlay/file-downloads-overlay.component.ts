import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FileList } from '@/pages/common/components/file-downloads-overlay/file-list/file-list';
import { MessageAttachment } from '@/api/models/message-attachment';

@Component({
    selector: 'app-file-downloads-overlay',
    imports: [CommonModule, DialogModule, FileList],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './file-downloads-overlay.component.html',
    styleUrl: './file-downloads-overlay.component.scss'
})
export class FileDownloadsOverlay {
    files = input<Array<MessageAttachment>>([]);
    visible = input(false);
    header = input('Attachments');
    close = output<void>();
}
