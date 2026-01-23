import { ChangeDetectionStrategy, Component, ElementRef } from '@angular/core';
import { AppMenu } from '@/layout/component/app-menu/app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppMenu],
    templateUrl: './app.sidebar.html',
    styleUrl: './app.sidebar.scss'
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
