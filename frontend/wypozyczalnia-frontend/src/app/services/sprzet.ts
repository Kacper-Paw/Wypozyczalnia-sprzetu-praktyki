import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprzetService {
  private apiUrl = 'http://localhost:8000/api/sprzet/';

  constructor(private http: HttpClient) {}
// Pobieranie listy sprzętu z backendu z uwzględnieniem filtrów
  pobierzSprzet(search?: string, dostepnosc?: boolean, page: number = 1): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
// wyszukiwanie po nazwie lub opisie, jeśli search jest zdefiniowane
    if (search) {
      params = params.set('search', search);
    }
// jesli dostepnosc jest true, dodajemy parametr do zapytania
    if (dostepnosc === true) {
      params = params.set('dostepnosc', 'true');
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  // 
  pobierzSzczegoly(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${id}/`);
  }
// Wypożyczenie sprzętu
  wypozyczSprzet(sprzetId: number, planowanaDataZwrotu: string): Observable<any> {
    return this.http.post<any>('http://localhost:8000/api/wypozycz/', {
      sprzet: sprzetId,
      planowana_data_zwrotu: planowanaDataZwrotu
    });
  }
}
