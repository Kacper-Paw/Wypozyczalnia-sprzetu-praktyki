from rest_framework import serializers
from ..models import Sprzet, Wypozyczenie

class SprzetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprzet
        fields = ['id', 'nazwa', 'nr_inwentarzowy', 'opis', 'kategoria', 'dostepnosc', 'is_wycofany']

class WypozyczenieHistoriaSerializer(serializers.ModelSerializer):
    uzytkownik_email = serializers.SerializerMethodField()

    class Meta:
        model = Wypozyczenie
        fields = ['id', 'data_wypozyczenia', 'planowana_data_zwrotu', 'data_zwrotu', 'uzytkownik_email']

    def get_uzytkownik_email(self, obj):
        request = self.context.get('request')
        if request and request.user.is_staff:
            return obj.uzytkownik.email
        return None

class SprzetDetailSerializer(serializers.ModelSerializer):
    wypozyczenia = WypozyczenieHistoriaSerializer(many=True, read_only=True)
    planowana_data_zwrotu = serializers.SerializerMethodField()

    class Meta:
        model = Sprzet
        fields = ['id', 'nazwa', 'nr_inwentarzowy', 'kategoria', 'opis', 'dostepnosc', 'is_wycofany', 'planowana_data_zwrotu', 'wypozyczenia']

    def get_planowana_data_zwrotu(self, obj):
        if not obj.dostepnosc:
            aktywne = obj.wypozyczenia.filter(data_zwrotu__isnull=True).last()
            if aktywne:
                return aktywne.planowana_data_zwrotu
        return None