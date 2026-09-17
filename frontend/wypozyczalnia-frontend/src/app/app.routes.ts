import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SprzetListComponent } from './components/sprzet-list/sprzet-list';
import { authGuard } from './guards/auth.guard';
import { SprzetDetailComponent } from './pages/sprzet-detail/sprzet-detail';
import { MojeWypozyczeniaComponent } from './pages/moje-wypozyczenia/moje-wypozyczenia';


// ścieżki routingu dla aplikacji, logowanie i rejestrowanie użytkownika. 
// gdy użytkownik wejdzie na stronę główną, zostanie przekierowany na stronę logowania.
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sprzet', component: SprzetListComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/sprzet', pathMatch: 'full' },
  { path: 'sprzet/:id', component: SprzetDetailComponent, canActivate: [authGuard] },
  { path: 'moje-wypozyczenia', component: MojeWypozyczeniaComponent, canActivate: [authGuard] },
];