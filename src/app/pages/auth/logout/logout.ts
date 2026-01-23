import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app.floatingconfigurator';
import { AuthService } from '@/pages/auth/auth-service';

@Component({
    selector: 'app-logout',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator, NgOptimizedImage],
    templateUrl: './logout.html',
    styleUrl: './logout.scss'
})
export class Logout implements OnInit {
    private authService: AuthService = inject(AuthService);
    ngOnInit(): void {
        this.authService.logout();
    }
}
