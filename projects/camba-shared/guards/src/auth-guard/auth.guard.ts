import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
// Assuming your AuthService uses Signals
// import { AuthService } from '../services/auth.service';

export const fluxAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const confirmationService = inject(ConfirmationService);

  // Mocking a signal-based check
  const isAuthenticated = false;

  if (isAuthenticated) {
    return true;
  }

  confirmationService.confirm({
    header: 'Security Check',
    message: 'Access restricted. Redirecting to login...',
    acceptButtonStyleClass: 'p-button-danger bg-red-600 border-none', // TW4 classes in PrimeNG
    rejectVisible: false,
    accept: () => {
      router.navigate(['/login']);
    }
  });

  return false;
};
