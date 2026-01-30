import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '@/layout/component/app-floating-configurator/app-floating-configurator.component';
import { AuthService } from '@/features/auth/auth-service';

@Component({
    selector: 'app-login',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class Login {
    private fb: FormBuilder = inject(FormBuilder);
    private authService: AuthService = inject(AuthService);
    form: FormGroup = this.fb.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });

    login() {
        const { email, password } = this.form.value as { email?: unknown; password?: unknown };
        const safeEmail = typeof email === 'string' ? email.trim() : '';
        const safePassword = typeof password === 'string' ? password.trim() : '';

        if (safeEmail && safePassword) {
            this.authService.login(safeEmail, safePassword);
        }
    }
}


