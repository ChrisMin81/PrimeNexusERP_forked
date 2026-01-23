import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app.floatingconfigurator';

@Component({
    selector: 'app-unauthorized-access',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator, ButtonModule, NgOptimizedImage],
    templateUrl: './unauthorized-access.html',
    styleUrl: './unauthorized-access.scss'
})
export class UnauthorizedAccess {}
