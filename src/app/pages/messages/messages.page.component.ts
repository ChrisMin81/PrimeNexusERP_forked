import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-test-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './messages.page.component.html',
    styleUrl: './messages.page.component.scss'
})
export class MessagesPage {}

