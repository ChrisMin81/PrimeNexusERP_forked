import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingService } from '@/core/services/loading/loading.service';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    imports: [ProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingComponent {
    loadingService = inject(LoadingService);
}
