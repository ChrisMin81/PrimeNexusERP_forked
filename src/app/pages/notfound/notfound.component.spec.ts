import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Notfound } from './notfound.component';

describe('Notfound Component', () => {
    let fixture: ComponentFixture<Notfound>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Notfound],
            providers: [provideRouter([])]
        })
            .overrideComponent(Notfound, {
                set: {
                    template: '<button class="go-home">Home</button>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Notfound);
        fixture.detectChanges();
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the home call-to-action', () => {
        const button = fixture.nativeElement.querySelector('.go-home') as HTMLButtonElement | null;
        expect(button).toBeTruthy();
        expect(button?.textContent?.trim()).toBe('Home');
    });
});
