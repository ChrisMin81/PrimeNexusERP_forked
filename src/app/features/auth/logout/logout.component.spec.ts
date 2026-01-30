import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Logout } from './logout.component';
import { AuthService } from '@/features/auth/auth-service';

describe('Logout Component', () => {
    let fixture: ComponentFixture<Logout>;
    let authService: jasmine.SpyObj<AuthService>;

    beforeEach(async () => {
        authService = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);

        await TestBed.configureTestingModule({
            imports: [Logout],
            providers: [
                { provide: AuthService, useValue: authService },
                provideRouter([])
            ]
        })
            .overrideComponent(Logout, {
                set: {
                    template: ''
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Logout);
    });

    it('calls logout on init', () => {
        fixture.detectChanges();
        expect(authService.logout).toHaveBeenCalledTimes(1);
    });
});

