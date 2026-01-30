import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-empty',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './empty.component.html',
    styleUrl: './empty.component.scss'
})
export class Empty {}

