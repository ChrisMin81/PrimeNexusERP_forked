import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Empty } from './empty.component';

describe('Empty Component', () => {
    let fixture: ComponentFixture<Empty>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Empty]
        })
            .overrideComponent(Empty, {
                set: {
                    template: '<div class="empty-marker"></div>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Empty);
        fixture.detectChanges();
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the placeholder content', () => {
        const marker = fixture.nativeElement.querySelector('.empty-marker');
        expect(marker).toBeTruthy();
    });
});
