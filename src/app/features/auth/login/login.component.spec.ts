import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { Login } from './login.component';
import { AuthService } from '@/features/auth/auth-service';
import { createSpyObj, type SpyObj } from '@/testing/spy';

describe('Login Component', () => {
    let fixture: ComponentFixture<Login>;
    let component: Login;
    let authService: SpyObj<AuthService>;

    beforeEach(async () => {
        authService = createSpyObj<AuthService>(['login']);

        await TestBed.configureTestingModule({
            imports: [Login, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authService },
                provideRouter([])
            ]
        })
            .overrideComponent(Login, {
                set: {
                    template: `
                        <form [formGroup]="form">
                            <input formControlName="email" />
                            <input formControlName="password" />
                            <button type="button" (click)="login()">Login</button>
                        </form>
                    `
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(Login);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('creates the component with required controls', () => {
        expect(component).toBeTruthy();
        expect(component.form.get('email')).toBeTruthy();
        expect(component.form.get('password')).toBeTruthy();
    });

    it('does not call authService.login when form is invalid or empty', () => {
        component.login();
        expect(authService.login).not.toHaveBeenCalled();

        component.form.setValue({ email: '', password: 'secret' });
        component.login();
        expect(authService.login).not.toHaveBeenCalled();

        component.form.setValue({ email: 'user@test.com', password: '' });
        component.login();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it('calls authService.login with sanitized values when valid', () => {
        const email = ' user@test.com ';
        const password = '  super-secret ';
        component.form.setValue({ email, password });

        component.login();

        expect(authService.login).toHaveBeenCalledOnce();
        expect(authService.login).toHaveBeenCalledWith('user@test.com', 'super-secret');
    });

    it('guards against prototype pollution when using form value', () => {
        component.form.setValue({ email: 'user@test.com', password: 'secret' });
        const formValue = component.form.value as Record<string, unknown>;
        Object.assign(formValue, { ['__proto__']: { admin: true }, extra: 'value' });

        component.login();

        expect(authService.login).toHaveBeenCalledOnce();
        expect(authService.login).toHaveBeenCalledWith('user@test.com', 'secret');
        const empty = {} as { admin?: boolean };
        expect(empty.admin).toBeUndefined();
    });
});

