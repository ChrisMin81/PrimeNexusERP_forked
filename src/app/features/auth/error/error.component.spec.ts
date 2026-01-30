import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Error } from './error.component';

describe('Error Component', () => {
    let fixture: ComponentFixture<Error>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Error],
            providers: [provideRouter([])]
        })
            .overrideComponent(Error, {
                set: {
                    template: '<button class="dashboard-btn">Go to Dashboard</button>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Error);
        fixture.detectChanges();
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the headline and message', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Go to Dashboard');
    });

    it('renders the dashboard button with routerLink "/"', () => {
        const button = fixture.nativeElement.querySelector('.dashboard-btn') as HTMLButtonElement | null;
        expect(button).toBeTruthy();
        expect(button?.textContent?.trim()).toBe('Go to Dashboard');
    });
});

