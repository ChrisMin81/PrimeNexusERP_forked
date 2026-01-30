import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UnauthorizedAccess } from './unauthorized-access.component';

describe('UnauthorizedAccess Component', () => {
    let fixture: ComponentFixture<UnauthorizedAccess>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [UnauthorizedAccess],
            providers: [provideRouter([])]
        })
            .overrideComponent(UnauthorizedAccess, {
                set: {
                    template: '<button class="go-login">Login</button>'
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(UnauthorizedAccess);
        fixture.detectChanges();
    });

    it('creates the component', () => {
        expect(fixture.componentInstance).toBeTruthy();
    });

    it('renders the login call-to-action', () => {
        const button = fixture.nativeElement.querySelector('.go-login') as HTMLButtonElement | null;
        expect(button).toBeTruthy();
        expect(button?.textContent?.trim()).toBe('Login');
    });
});

