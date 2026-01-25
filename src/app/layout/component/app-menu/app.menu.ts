import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from '@/layout/component/app-menuitem/app.menuitem';
import { MenuModelService } from '@/layout/service/menu-model.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, AppMenuitem, RouterModule],
    templateUrl: './app.menu.html',
    styleUrl: './app.menu.scss'
})
export class AppMenu {
    model: MenuItem[] = [];
    private menuModel = inject(MenuModelService);

    ngOnInit() {
        this.model = this.menuModel.getMenuItems();
    }
}
