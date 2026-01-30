import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app-floating-configurator.component';

@Component({
    selector: 'app-unauthorized-access',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator, ButtonModule, NgOptimizedImage],
    templateUrl: './unauthorized-access.component.html',
    styleUrl: './unauthorized-access.component.scss'
})
export class UnauthorizedAccess {}


