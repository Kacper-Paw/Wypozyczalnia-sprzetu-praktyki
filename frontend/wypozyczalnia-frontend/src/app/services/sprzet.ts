import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprzet } from '../models/sprzet';

@Injectable({
  providedIn: 'root'
})
export class SprzetService {
  private apiUrl = 'http://127.0.0.1:8000/api/sprzet/';

  constructor(private http: HttpClient) {}

  pobierzSprzet(search: string = '', onlyAvailable: boolean = false, page: number = 1): Observable<any> {
    let params = new HttpParams().set('page', page.toString());
    
    if (search) {
      params = params.set('search', search);
    }
    if (onlyAvailable) {
      params = params.set('dostepny', 'true');
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  wypozyczSprzet(sprzetId: number, planowanaDataZwrotu: string) {
  return this.http.post('http://127.0.0.1:8000/api/sprzet/wypozyczenia/', {
    sprzet: sprzetId,
    planowana_data_zwrotu: planowanaDataZwrotu
  });
}
// Pobieranie szczegółów sprzętu / API
getSprzetSzczegoly(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${id}/`);
}
}