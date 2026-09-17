from django.urls import path
from .views.Equipment_views import lista_sprzetu, wypozycz_sprzet, szczegoly_sprzetu
from .views.Equipment_views import moje_wypozyczenia

urlpatterns = [
    path('', lista_sprzetu, name='lista_sprzetu'),
    path('wypozyczenia/', wypozycz_sprzet, name='wypozycz_sprzet'),
    path('moje-wypozyczenia/', moje_wypozyczenia, name='moje_wypozyczenia'),
    path('<int:pk>/', szczegoly_sprzetu, name='szczegoly_sprzetu'), 
]
