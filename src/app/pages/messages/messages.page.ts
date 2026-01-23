import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-test-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './messages.page.html',
    styleUrl: './messages.page.scss'
})
export class MessagesPage {}
