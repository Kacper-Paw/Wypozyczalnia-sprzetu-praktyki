import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SprzetService } from '../../services/sprzet';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent implements OnInit {
  // Aktywna zakładka: 'sprzet' albo 'wypozyczenia'
  aktywnaZakladka: string = 'sprzet';

  // Dane sprzętu
  listaSprzetu: any[] = [];
  pokazFormularz: boolean = false;
  czyEdycja: boolean = false;
  edytowaneId: number | null = null;

  // Pola z formularza
  nazwa: string = '';
  nrInwentarzowy: string = '';
  kategoria: string = '';
  opis: string = '';

  // Dane wypożyczeń
  listaWypozyczen: any[] = [];
  filtrStatus: string = '';

  // Komunikaty
  komunikat: string = '';
  blad: string = '';

  constructor(private sprzetService: SprzetService) {}

  ngOnInit(): void {
    this.pobierzSprzet();
    this.pobierzWypozyczenia();
  }

  zmienZakladke(nazwa: string) {
    this.aktywnaZakladka = nazwa;
    this.komunikat = '';
    this.blad = '';
  }

  // SEKCJA SPRZĘTU 
  pobierzSprzet() {
    this.sprzetService.getAdminSprzet().subscribe({
      next: (data) => {
        this.listaSprzetu = data;
      },
      error: (err) => {
        console.log('Błąd pobierania sprzętu:', err);
      }
    });
  }

  otworzDodawanie() {
    this.czyEdycja = false;
    this.edytowaneId = null;
    this.nazwa = '';
    this.nrInwentarzowy = '';
    this.kategoria = '';
    this.opis = '';
    this.pokazFormularz = true;
    this.komunikat = '';
    this.blad = '';
  }

  otworzEdycje(item: any) {
    this.czyEdycja = true;
    this.edytowaneId = item.id;
    this.nazwa = item.nazwa;
    this.nrInwentarzowy = item.nr_inwentarzowy;
    this.kategoria = item.kategoria;
    this.opis = item.opis;
    this.pokazFormularz = true;
    this.komunikat = '';
    this.blad = '';
  }

  zapiszSprzet() {
    this.komunikat = '';
    this.blad = '';

    const dane = {
      nazwa: this.nazwa,
      nr_inwentarzowy: this.nrInwentarzowy,
      kategoria: this.kategoria,
      opis: this.opis
    };

    if (this.czyEdycja && this.edytowaneId) {
      // Edycja
      this.sprzetService.edytujSprzet(this.edytowaneId, dane).subscribe({
        next: () => {
          this.komunikat = 'Zapisano zmiany w sprzęcie!';
          this.pokazFormularz = false;
          this.pobierzSprzet();
        },
        error: (err) => {
          if (err.error && err.error.nr_inwentarzowy) {
            this.blad = 'Ten numer inwentarzowy już istnieje w bazie!';
          } else {
            this.blad = 'Błąd podczas edycji sprzętu.';
          }
        }
      });
    } else {
      // Dodawanie
      this.sprzetService.dodajSprzet(dane).subscribe({
        next: () => {
          this.komunikat = 'Dodano nowy sprzęt!';
          this.pokazFormularz = false;
          this.pobierzSprzet();
        },
        error: (err) => {
          if (err.error && err.error.nr_inwentarzowy) {
            this.blad = 'Ten numer inwentarzowy już istnieje w bazie!';
          } else {
            this.blad = 'Błąd podczas dodawania sprzętu.';
          }
        }
      });
    }
  }

  wycofaj(id: number) {
    if (confirm('Na pewno wycofać ten sprzęt z katalogu?')) {
      this.sprzetService.wycofajSprzet(id).subscribe({
        next: (res) => {
          this.komunikat = res.detail;
          this.pobierzSprzet();
        },
        error: (err) => {
          if (err.error && err.error.detail) {
            this.blad = err.error.detail;
          } else {
            this.blad = 'Nie udało się wycofać tego sprzętu.';
          }
        }
      });
    }
  }

  // SEKCJA WYPOŻYCZEŃ 
  pobierzWypozyczenia() {
    this.sprzetService.getAdminWypozyczenia(this.filtrStatus).subscribe({
      next: (data) => {
        this.listaWypozyczen = data;
      },
      error: (err) => {
        console.log('Błąd pobierania wypożyczeń:', err);
      }
    });
  }

  potwierdzZwrot(id: number) {
    this.sprzetService.potwierdzZwrot(id).subscribe({
      next: (res) => {
        this.komunikat = res.detail;
        this.pobierzWypozyczenia();
        this.pobierzSprzet();
      },
      error: (err) => {
        if (err.error && err.error.detail) {
          this.blad = err.error.detail;
        } else {
          this.blad = 'Błąd podczas potwierdzania zwrotu.';
        }
      }
    });
  }
}