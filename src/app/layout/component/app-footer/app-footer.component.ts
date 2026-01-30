import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './app-footer.component.html',
    styleUrl: './app-footer.component.scss'
})
export class AppFooter {}

