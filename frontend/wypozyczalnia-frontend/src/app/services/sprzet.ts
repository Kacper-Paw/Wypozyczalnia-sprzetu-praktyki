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
  pobierzMojeWypozyczenia() {
    return this.http.get<any>('http://127.0.0.1:8000/api/sprzet/moje-wypozyczenia/');
  }

  // API ADMINA (Zakładka 5) 
  getAdminSprzet(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}admin/sprzet/`);
  }

  dodajSprzet(sprzetData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}admin/sprzet/dodaj/`, sprzetData);
  }

  edytujSprzet(id: number, sprzetData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}admin/sprzet/${id}/edytuj/`, sprzetData);
  }

  wycofajSprzet(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}admin/sprzet/${id}/wycofaj/`, {});
  }

  getAdminWypozyczenia(statusFilter: string = ''): Observable<any[]> {
    let params = new HttpParams();
    if (statusFilter) params = params.set('status', statusFilter);
    return this.http.get<any[]>(`${this.apiUrl}admin/wypozyczenia/`, { params });
  }

  potwierdzZwrot(wypozyczenieId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}admin/wypozyczenia/${wypozyczenieId}/zwrot/`, {});
  }
}


