import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app-floating-configurator.component';

@Component({
    selector: 'app-notfound',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    templateUrl: './notfound.component.html',
    styleUrl: './notfound.component.scss'
})
export class Notfound {}


