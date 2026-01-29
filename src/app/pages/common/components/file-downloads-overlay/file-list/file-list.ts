import { Component, input } from '@angular/core';
import { MessageAttachment } from 'api';

@Component({
    selector: 'app-file-list',
    imports: [],
    templateUrl: './file-list.html',
    styleUrl: './file-list.scss'
})
export class FileList {
    header = input<string>('Attachments:');
    files = input<Array<MessageAttachment>>([]);
}
