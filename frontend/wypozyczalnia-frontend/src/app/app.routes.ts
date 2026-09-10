import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

// ścieżki routingu dla aplikacji, logowanie i rejestrowanie użytkownika. 
// gdy użytkownik wejdzie na stronę główną, zostanie przekierowany na stronę logowania.
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];