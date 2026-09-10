import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    // Flaga sprawdza czy token jest odświeżany przez true/false żeby nie wysyłać wielu żadan naraz
  private isRefreshing = false;
    //  Behaviorsubject: Jest to rodzaj Observable, który przechowuje ostatnią wartość i emituje ją do nowych subskrybentów.
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    // Dodanie tokena jeśli jest dostępny
    if (token) {
      request = this.addTokenHeader(request, token);
    }

    return next.handle(request).pipe(
      catchError(error => {
        // jeśli serwer zwróci błąd 401 i to nie było logowanie
        if (error instanceof HttpErrorResponse && error.status === 401 && !request.url.includes('/login/')) {
          return this.handle401Error(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  // Clone(): Nie można bezpośrednio edytować zapytania HTTP, wiec wykorzystujemy clone() żeby zrobić kopie zapytania do której doklejamy nagłowek z tokenem Bearer. Wtedy serwer wie że użytkownik jest zalogowany i może wykonać żądanie.

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) { // sprawdzanie czy token jest odświeżany
    if (!this.isRefreshing) {
      this.isRefreshing = true; // oznacza że token jest odświeżany
      this.refreshTokenSubject.next(null);

        // prosimy o nowy token
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false; // oznacza że token został odświeżony.
          this.refreshTokenSubject.next(token.access);
          return next.handle(this.addTokenHeader(request, token.access));
        }),
        // jesli token wygasł albo sie nie odswieżył, wylogowujemy user'a i wyrzucamy błąd
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }
    // Jesli juz sie odświeża pare razy (kolejne zapytania HTTP trafiają tutaj):

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1), // pobieramy wartość tylko 1 raz
      switchMap((token) => next.handle(this.addTokenHeader(request, token))) // ponawiamy zapytanie z nowym tokenem
    );
  }
}