import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { AppMenu } from '@/layout/component/app-menu/app-menu.component';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AppMenu],
    templateUrl: './app-sidebar.component.html',
    styleUrl: './app-sidebar.component.scss'
})
export class AppSidebar {
    public el = inject(ElementRef);
}


