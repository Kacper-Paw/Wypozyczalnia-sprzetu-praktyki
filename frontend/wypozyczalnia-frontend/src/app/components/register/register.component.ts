import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// [(ngModel)]: Wpisywane dane w formularzu trafiają odrazu do zmiennych w Klasie typescript
// onRegister(): Funkcja wywoływana po kliknięciu przycisku "Zarejestruj się" w formularzu rejestracji. 
// Sprawdza czy hasła są identyczne, a następnie wywołuje metodę register() z serwisu AuthService, aby zarejestrować użytkownika. 
// W przypadku sukcesu przekierowuje użytkownika na stronę logowania, a w przypadku błędu wyświetla komunikat o błędzie.

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // Formularz HTML z stylem Kontenera, (Formularz - Rejestracja)
  template: `
    <div style="max-width: 350px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
      <h2>Rejestracja</h2>
      <form (ngSubmit)="onRegister()">
        <div style="margin-bottom: 10px;">
          <label>Nazwa użytkownika:</label><br>
          <input type="text" [(ngModel)]="userData.username" name="username" required style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Email:</label><br>
          <input type="email" [(ngModel)]="userData.email" name="email" required style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Hasło:</label><br>
          <input type="password" [(ngModel)]="userData.password" name="password" required style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Potwierdź hasło:</label><br>
          <input type="password" [(ngModel)]="userData.password2" name="password2" required style="width: 100%;">
        </div>
        <button type="submit" style="width: 100%; padding: 8px; background-color: #28a745; color: white; border: none; cursor: pointer;">
          Zarejestruj się
        </button>
      </form>
      <p *ngIf="errorMessage" style="color: red; margin-top: 10px;">{{ errorMessage }}</p>
    </div>
  `
})
export class RegisterComponent {
  userData = { username: '', email: '', password: '', password2: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
  if (this.userData.password !== this.userData.password2) {
    this.errorMessage = 'Hasła nie są identyczne!';
    return;
  }

  // Tworzymy czysty obiekt do wysłania do Django (bez password2 - Po błedzie 400 na stronie w trakcie debugu)
// Zamiast usuwać, przekazujemy powtorz_haslo w nazwie, której wymaga Django
  const payload = {
    username: this.userData.username,
    email: this.userData.email,
    password: this.userData.password,
    powtorz_haslo: this.userData.password2
  };

  this.authService.register(payload).subscribe({
    next: () => {
      alert('Konto zostało utworzone! Możesz się teraz zalogować.');
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.log('Błąd z backendu:', err.error); // Wypisze w konsoli przeglądarki (F12) dokładny powód
      this.errorMessage = 'Błąd podczas rejestracji. Sprawdź wpisane dane.';
    }
  });
}}