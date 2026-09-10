import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

// Schemat odpowiedzi z Django 

export interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api'; // Adres API backendu Django

  constructor(private http: HttpClient) {}

  // Register(data) wysyła zapytanie POST z danymi formularza pod adres do rejestracji

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register/`, data);
  }

  // Ściąga: Operator Tap: Pozwala podglądnąć odpowiedz z serwera zanim trafi ona do komponentu. 
  // Gdy zwraca on token i role użytkownika, użwyamy saveSession aby zapisac je.

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      tap(response => this.saveSession(response))
    );
  }

  refreshToken(): Observable<{ access: string }> {
    const refresh = localStorage.getItem('refresh_token');
    return this.http.post<{ access: string }>(`${this.apiUrl}/refresh/`, { refresh }).pipe(
      tap(res => localStorage.setItem('access_token', res.access))
    );
  }

  // Ten kawałek służy do zapisywania dwóch tokenów, nazwy i roli użytkownika w localstorage. 

  private saveSession(response: LoginResponse): void {
    localStorage.setItem('access_token', response.access);
    localStorage.setItem('refresh_token', response.refresh);
    localStorage.setItem('username', response.username);
    localStorage.setItem('role', response.role);
  }

  //Funkcja która wyczyści dane z localStorage przy wylogowaniu

  logout(): void {
    localStorage.clear();
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }
}
