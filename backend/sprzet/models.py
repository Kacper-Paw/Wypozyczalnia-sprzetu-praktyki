from django.db import models

class Sprzet(models.Model):
    nazwa = models.CharField(max_length=100)
    opis = models.TextField()
    kategoria = models.CharField(max_length=100)
    dostepnosc = models.BooleanField(default=True)

    def __str__(self):
        return self.nazwa
