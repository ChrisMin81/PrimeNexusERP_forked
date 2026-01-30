import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesPage } from './messages.page.component';

describe('MessagesPage Component', () => {
    let fixture: ComponentFixture<MessagesPage>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessagesPage]
        })
            .overrideComponent(MessagesPage, {
                set: {
                    template: '<div class="messages-page"></div>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(MessagesPage);
        fixture.detectChanges();
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the placeholder content', () => {
        const node = fixture.nativeElement.querySelector('.messages-page');
        expect(node).toBeTruthy();
    });
});
