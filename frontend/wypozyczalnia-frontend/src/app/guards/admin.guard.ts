import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('role'); // Pobieramy ciąg znaków ('admin' lub 'user')

  if (role === 'admin') {
    return true; // Użytkownik jest adminem - zezwól na przejście
  }

  // Brak uprawnień - przekieruj na katalog i zablokuj nawigację
  router.navigate(['/sprzet']);
  return false;
};

