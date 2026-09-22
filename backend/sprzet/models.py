from django.db import models
from django.conf import settings

class Sprzet(models.Model):
    nazwa = models.CharField(max_length=100)
    nr_inwentarzowy = models.CharField(max_length=50, unique=True)
    opis = models.TextField()
    kategoria = models.CharField(max_length=100)
    dostepnosc = models.BooleanField(default=True)
    is_wycofany = models.BooleanField(default=False)  # Wycofane przedmioty nie są w katalogu

    def __str__(self):
        return f"{self.nazwa} ({self.nr_inwentarzowy})"
# Model reprezentujący wypożyczenie sprzętu
class Wypozyczenie(models.Model):
    uzytkownik = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wypozyczenia')
    sprzet = models.ForeignKey(Sprzet, on_delete=models.CASCADE, related_name='wypozyczenia')
    data_wypozyczenia = models.DateField(auto_now_add=True)
    planowana_data_zwrotu = models.DateField()
    data_zwrotu = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.uzytkownik} - {self.sprzet.nazwa}"