/* import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SprzetService } from '../../services/sprzet';

@Component({
  selector: 'app-sprzet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sprzet-detail.html',
  styleUrl: './sprzet-detail.css'
})
export class SprzetDetailComponent implements OnInit {
  sprzet: any = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private sprzetService: SprzetService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (id) {
      this.pobierzSzczegoly(id);
    } else {
      this.errorMessage = 'Nieprawidłowy identyfikator sprzętu.';
      this.loading = false;
    }
  }

  pobierzSzczegoly(id: number): void {
    this.loading = true;
    
    this.sprzetService.getSprzetSzczegoly(id).subscribe({
      next: (data: any) => {
        console.log('Otrzymano dane sprzętu:', data);
        this.sprzet = data;
        this.loading = false; // Przestawiamy flagę – ładowanie zakończone sukcesem!
      },
      error: (err: any) => {
        console.error('Błąd pobierania szczegółów:', err);
        this.errorMessage = 'Nie udało się pobrać szczegółów przedmiotu.';
        this.loading = false;
      }
    });
  }
}
  */


import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SprzetService } from '../../services/sprzet';

@Component({
  selector: 'app-sprzet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sprzet-detail.html',
  styleUrl: './sprzet-detail.css'
})
export class SprzetDetailComponent implements OnInit {
  sprzet: any = null;
  loading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    @Inject(SprzetService) private sprzetService: SprzetService,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef // Wstrzykujemy ChangeDetectorRef, aby wymusić aktualizację widoku po zmianie danych - Troubleshooting po problemach z niewyświetlaniem danych
  ) {}

  ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = Number(params.get('id'));
    if (id) {
      this.loading = true; // Zawsze ustawiaj loading na true!
      this.sprzetService.pobierzSzczegoly(id).subscribe({
        next: (data: any) => {
          console.log('Dane odebrane:', data);
          this.sprzet = data;
          this.loading = false;
          this.cdr.detectChanges(); // Wymusza aktualizację widoku po zmianie danych
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = 'Nie udało się pobrać szczegółów sprzętu.';
          this.loading = false;
        }
      });
    }
  });
}
  }
