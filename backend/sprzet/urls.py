from django.urls import path
from .views.Equipment_views import lista_sprzetu, wypozycz_sprzet, szczegoly_sprzetu

urlpatterns = [
    path('', lista_sprzetu, name='lista_sprzetu'),
    path('wypozyczenia/', wypozycz_sprzet, name='wypozycz_sprzet'),
    path('<int:pk>/', szczegoly_sprzetu, name='szczegoly_sprzetu'), 
]
