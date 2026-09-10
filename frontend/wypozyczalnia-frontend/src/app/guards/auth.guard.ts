import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

// CanActivateFn: sposób tworzenia Guardów w Angularze. Ta funkcja zwraca true (dostajesz wjazd na stronę) lub false (brak dostępu i do logowania).

export const authGuard: CanActivateFn = (route, state) => {
    // wstrzykiwanie serwisów: AuthService i Router do strażnika
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // User jest zalogowany, wpuszczamy go na strone
  } else {
    router.navigate(['/login']); // Nie ma tokena to wraca do strony logowania
    return false;
  }
};