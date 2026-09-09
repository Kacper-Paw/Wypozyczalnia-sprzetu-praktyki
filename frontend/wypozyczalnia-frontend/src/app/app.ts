import { Component, OnInit } from '@angular/core';
import { SprzetService } from './services/sprzet';
import { Sprzet } from './models/sprzet';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  sprzety: Sprzet[] = [];

  constructor(private sprzetService: SprzetService) {}

  ngOnInit(): void {
    this.pobierzSprzet();
  }

  pobierzSprzet(): void {
    this.sprzetService.pobierzSprzet().subscribe({
      next: (dane) => {
        this.sprzety = dane;
        console.log('Pobrano sprzęt:', dane);
      },
      error: (blad) => {
        console.error('Błąd podczas pobierania sprzętu:', blad);
      }
    });
  }

}