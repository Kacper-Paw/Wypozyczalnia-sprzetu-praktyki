from django.urls import path
from .views.Equipment_views import lista_sprzetu, wypozycz_sprzet

urlpatterns = [
    path('', lista_sprzetu, name='lista-sprzetu'),
    path('wypozyczenia/', wypozycz_sprzet, name='wypozycz-sprzet'),
]