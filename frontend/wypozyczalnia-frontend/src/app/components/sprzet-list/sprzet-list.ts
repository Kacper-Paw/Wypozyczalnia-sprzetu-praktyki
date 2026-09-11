import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SprzetService } from '../../services/sprzet';
import { Sprzet } from '../../models/sprzet';

@Component({
  selector: 'app-sprzet-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sprzet-list.html',
  styleUrl: './sprzet-list.css'
})
export class SprzetListComponent implements OnInit {
  // Stan listy i filtrów
  sprzety: Sprzet[] = [];
  searchQuery: string = '';
  onlyAvailable: boolean = false;

  // Stan okna wypożyczenia i zmienne do obsługi wypożyczenia
  selectedSprzetId: number | null = null;
  planowanaDataZwrotu: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private sprzetService: SprzetService) {}

  ngOnInit(): void {
    this.wczytajSprzet();
  }

  // Pobieranie listy sprzętu z uwzględnieniem filtrów z backendu
  wczytajSprzet(): void {
    this.sprzetService.pobierzSprzet(this.searchQuery, this.onlyAvailable).subscribe({
      next: (data) => {
        // Obsługa odpowiedzi w zależności od paginacji (results)
        this.sprzety = data.results ? data.results : data;
      },
      error: (err) => console.error('Błąd pobierania sprzętu:', err)
    });
  }

  // Otwiera wyskakujące okno wypożyczenia i wylicza datę zwrotu
  otworzModal(id: number): void {
    this.selectedSprzetId = id;
    this.errorMessage = '';
    this.successMessage = '';
    
    // ustawiamy datę zwrotu na 7 dni
    const zaTydzien = new Date();
    zaTydzien.setDate(zaTydzien.getDate() + 7);
    this.planowanaDataZwrotu = zaTydzien.toISOString().split('T')[0];
  }

  // Zamyka okno 
  zamknijModal(): void {
    this.selectedSprzetId = null;
  }

  // Wysyła żądanie wypożyczenia do bazy django
  potwierdzWypozyczenie(): void {
    if (!this.selectedSprzetId || !this.planowanaDataZwrotu) return;

    this.sprzetService.wypozyczSprzet(this.selectedSprzetId, this.planowanaDataZwrotu).subscribe({
      next: () => {
        this.successMessage = 'Pomyślnie wypożyczono sprzęt!';
        this.zamknijModal();
        this.wczytajSprzet(); // Pobiera odświeżoną listę / zmienia status wypożyczenia
      },
      error: (err) => {
        // Odbiera komunikat odmowy 
        this.errorMessage = err.error?.detail || err.error?.message || 'Nie udało się wypożyczyć sprzętu.';
      }
    });
  }
}