import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloadsOverlay } from './file-downloads-overlay.component';

describe('FileDownloadsOverlay Component', () => {
    let fixture: ComponentFixture<FileDownloadsOverlay>;
    let component: FileDownloadsOverlay;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileDownloadsOverlay]
        })
            .overrideComponent(FileDownloadsOverlay, {
                set: {
                    template: '<button class="close" (click)="closed.emit()">Close</button>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(FileDownloadsOverlay);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('emits closed when close is triggered', () => {
        const emitted: number[] = [];
        component.closed.subscribe(() => emitted.push(1));

        const button = fixture.nativeElement.querySelector('.close') as HTMLButtonElement | null;
        button?.click();

        expect(emitted).toEqual([1]);
    });
});
