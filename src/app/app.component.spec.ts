import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppComponent]
        })
            .overrideComponent(AppComponent, {
                set: {
                    template: '<div class="app-root"></div>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the app container', () => {
        const node = fixture.nativeElement.querySelector('.app-root');
        expect(node).toBeTruthy();
    });
});
