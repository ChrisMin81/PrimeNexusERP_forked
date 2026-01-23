import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app.floatingconfigurator';

@Component({
    selector: 'app-notfound',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterModule, AppFloatingConfigurator, ButtonModule],
    templateUrl: './notfound.html',
    styleUrl: './notfound.scss'
})
export class Notfound {}
