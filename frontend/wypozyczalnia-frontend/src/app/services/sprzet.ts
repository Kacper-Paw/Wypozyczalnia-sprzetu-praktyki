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

  wypozyczSprzet(sprzetId: number, dataZwrotu: string): Observable<any> {
    return this.http.post<any>('http://127.0.0.1:8000/api/wypozyczenia/', {
      sprzet_id: sprzetId,
      planowana_data_zwrotu: dataZwrotu
    });
  }
}