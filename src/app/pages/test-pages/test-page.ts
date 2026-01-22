import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-test-page',
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="grid grid-cols-12 gap-8">
            <div class="col-start-3 col-span-6 xl:col-start-3 xl:col-span-6">
                <div class="card">
                    <div class="font-semibold text-xl mb-4">Empty Test Page</div>
                    <p>Use this page to start from scratch and place your custom content.</p>
                </div>
            </div>
        </div>
    `
})
export class TestPage {}
