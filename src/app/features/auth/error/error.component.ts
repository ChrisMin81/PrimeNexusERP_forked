import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app-floating-configurator.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
    selector: 'app-error',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, RippleModule, RouterModule, AppFloatingConfigurator, ButtonModule, NgOptimizedImage],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class Error {}


