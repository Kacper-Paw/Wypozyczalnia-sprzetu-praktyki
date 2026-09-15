import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SprzetService } from '../../services/sprzet';
import { Sprzet } from '../../models/sprzet';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sprzet-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sprzet-list.html',
  styleUrl: './sprzet-list.css'
})
export class SprzetListComponent implements OnInit {
  // Stan listy i filtrów
  sprzety: Sprzet[] = [];
  searchQuery: string = '';
  onlyAvailable: boolean = false;

  // Pola paginacji - 20 wyników na 1 stronę.
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;

  // Stan okna wypożyczenia i zmienne do obsługi wypożyczenia
  selectedSprzetId: number | null = null;
  planowanaDataZwrotu: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  // Stan okna szczegółów przedmiotu
  wybranySprzetSzczegoly: Sprzet | null = null;

  constructor(private sprzetService: SprzetService) {}

  ngOnInit(): void {
    this.wczytajSprzet();
  }

  // Pobieranie listy sprzętu z uwzględnieniem filtrów z backendu
  wczytajSprzet(page: number = 1): void {
    this.currentPage = page;
    this.sprzetService.pobierzSprzet(this.searchQuery, this.onlyAvailable, this.currentPage).subscribe({
      next: (data) => {
        if (data.results) {
          this.sprzety = data.results;
          // Obliczamy łączną liczbę stron na podstawie 'count' z Django REST
          this.totalPages = Math.ceil(data.count / this.pageSize) || 1;
        } else {
          this.sprzety = data;
          this.totalPages = 1;
        }
      },
      error: (err) => console.error('Błąd pobierania sprzętu:', err)
    });
  }

  // Metoda do zmiany strony
  zmieniajStrone(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.wczytajSprzet(page);
    }
  }

  // Metody do obsługi okna szczegółów przedmiotu
  otworzSzczegoly(s: Sprzet): void {
    console.log('Wybrany sprzęt do podglądu:', s);
    this.wybranySprzetSzczegoly = s;
  }

  zamknijSzczegoly(): void {
    this.wybranySprzetSzczegoly = null;
  }

  // Otwiera wyskakujące okno wypożyczenia i wylicza datę zwrotu
  otworzModal(id: number): void {
    this.selectedSprzetId = id;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Ustawiamy datę zwrotu na +7 dni od dzisiaj
    const zaTydzien = new Date();
    zaTydzien.setDate(zaTydzien.getDate() + 7);
    this.planowanaDataZwrotu = zaTydzien.toISOString().split('T')[0];
  }

  // Zamyka okno wypożyczenia
  zamknijModal(): void {
    this.selectedSprzetId = null;
  }

  // Wysyła żądanie wypożyczenia do API Django
  potwierdzWypozyczenie(): void {
    if (!this.selectedSprzetId || !this.planowanaDataZwrotu) return;

    this.sprzetService.wypozyczSprzet(this.selectedSprzetId, this.planowanaDataZwrotu).subscribe({
      next: () => {
        this.successMessage = 'Pomyślnie wypożyczono sprzęt!';
        this.zamknijModal();
        this.wczytajSprzet(); // Pobiera odświeżoną listę / zmienia status wypożyczenia
      },
      error: (err) => {
        // Odbiera komunikat odmowy z backendu
        this.errorMessage = err.error?.detail || err.error?.message || 'Nie udało się wypożyczyć sprzętu.';
      }
    });
  }
}