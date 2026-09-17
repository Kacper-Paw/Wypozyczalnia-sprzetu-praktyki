import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SprzetService } from '../../services/sprzet';
// Komponent MojeWypozyczeniaComponent, który wyświetla listę wypożyczeń użytkownika
@Component({
  selector: 'app-moje-wypozyczenia',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moje-wypozyczenia.html'
})
export class MojeWypozyczeniaComponent implements OnInit {
  aktywne: any[] = []; // Tablica przechowująca aktywne wypożyczenia
  zakonczone: any[] = []; // Tablica przechowująca zakończone wypożyczenia
  loading: boolean = true;
// Konstruktor komponentu, wstrzykujący serwis SprzetService i ChangeDetectorRef
  constructor(
    private sprzetService: SprzetService,
    private cdr: ChangeDetectorRef
  ) {}
// Pobieranie wypożyczeń user'a z backendu
  ngOnInit(): void {
    this.sprzetService.pobierzMojeWypozyczenia().subscribe({
      next: (data) => {
        this.aktywne = data.aktywne;
        this.zakonczone = data.zakonczone;
        this.loading = false;
        this.cdr.detectChanges();  
      },
      error: (err) => {
        console.error(err); // Logowanie błędu w przypadku niepowodzenia zapytania
        this.loading = false; // Ustawienie loading na false w przypadku błędu
        this.cdr.detectChanges(); // Wymuszenie detekcji zmian po aktualizacji stanu loading
      }
    });
  }
}
