import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '@/services/loading/loading.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, LoadingComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <loading></loading>
        <router-outlet></router-outlet>
    `
})
export class AppComponent {}
