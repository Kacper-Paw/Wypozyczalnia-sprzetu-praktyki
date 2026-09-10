import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Definicja Ngsubmit i onlogin() jest w pliku register.component.ts, 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // Formularz HTML z stylem Kontenera, (Formularz - Logowanie)
  template: `
    <div style="max-width: 350px; margin: 50px auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
      <h2>Logowanie</h2>
      <form (ngSubmit)="onLogin()">
        <div style="margin-bottom: 10px;">
          <label>Nazwa użytkownika:</label><br>
          <input type="text" [(ngModel)]="credentials.username" name="username" required style="width: 100%;">
        </div>
        <div style="margin-bottom: 10px;">
          <label>Hasło:</label><br>
          <input type="password" [(ngModel)]="credentials.password" name="password" required style="width: 100%;">
        </div>
        <button type="submit" style="width: 100%; padding: 8px; background-color: #007bff; color: white; border: none; cursor: pointer;">
          Zaloguj się
        </button>
      </form>
      <p *ngIf="errorMessage" style="color: red; margin-top: 10px;">{{ errorMessage }}</p>
    </div>
  `
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    // przekazujemy dane logowania do authservice'u Lecz metoda ta zwraca Observable, przygotowywuje cos kroju 'Paczki'
    // za to kiedy dochodzi to do .subscribe() - Paczka leci do serwera i czeka na odpowiedz.
    this.authService.login(this.credentials).subscribe({
        // jesli wszystko poszło dobrze, to wyświetlamy alert i przekierowujemy na strone główną
      next: () => {
        alert('Zalogowano pomyślnie!');
        this.router.navigate(['/']); // Przekierowanie na stronę główną po zalogowaniu
      },
      error: (err) => {
        this.errorMessage = 'Błędny login lub hasło!';
      }
    });
  }
}