import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sprzet } from '../models/sprzet';

@Injectable({
  providedIn: 'root'
})
export class SprzetService {

  private apiUrl = 'http://127.0.0.1:8000/api/sprzet/';

  constructor(private http: HttpClient) {}

  pobierzSprzet(): Observable<Sprzet[]> {
    return this.http.get<Sprzet[]>(this.apiUrl);
  }

}