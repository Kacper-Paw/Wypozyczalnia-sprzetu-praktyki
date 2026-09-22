from django.urls import path
from .views.Equipment_views import lista_sprzetu, wypozycz_sprzet, szczegoly_sprzetu
from .views.Equipment_views import moje_wypozyczenia
from .views import admin_views

urlpatterns = [
    path('', lista_sprzetu, name='lista_sprzetu'), # Dodano ścieżkę do widoku listy sprzętu
    path('wypozyczenia/', wypozycz_sprzet, name='wypozycz_sprzet'), # Dodano ścieżkę do widoku wypożyczeń
    path('moje-wypozyczenia/', moje_wypozyczenia, name='moje_wypozyczenia'), # Dodano ścieżkę do widoku wypożyczeń user'a
    path('<int:pk>/', szczegoly_sprzetu, name='szczegoly_sprzetu'), # Dodano ścieżkę do szczegółów sprzętu
    # API ADMINA - SPRZĘT
    path('admin/sprzet/', admin_views.admin_lista_sprzetu, name='admin-lista-sprzetu'),
    path('admin/sprzet/dodaj/', admin_views.admin_dodaj_sprzet, name='admin-dodaj-sprzet'),
    path('admin/sprzet/<int:pk>/edytuj/', admin_views.admin_edytuj_sprzet, name='admin-edytuj-sprzet'),
    path('admin/sprzet/<int:pk>/wycofaj/', admin_views.admin_wycofaj_sprzet, name='admin-wycofaj-sprzet'),
    # API ADMINA - WYPOŻYCZENIA
    path('admin/wypozyczenia/', admin_views.admin_lista_wypozyczen, name='admin-lista-wypozyczen'),
    path(
        'admin/wypozyczenia/<int:wypozyczenie_id>/zwrot/',
        admin_views.admin_potwierdz_zwrot,
        name='admin-potwierdz-zwrot',
    ),
]
