from django.contrib import admin
from .models import Sprzet

@admin.register(Sprzet)
class SprzetAdmin(admin.ModelAdmin):
    list_display = ('nazwa', 'kategoria', 'dostepnosc')
    search_fields = ('nazwa', 'kategoria')
    list_filter = ('kategoria', 'dostepnosc')