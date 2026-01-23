import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-empty',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './empty.html',
    styleUrl: './empty.scss'
})
export class Empty {}
