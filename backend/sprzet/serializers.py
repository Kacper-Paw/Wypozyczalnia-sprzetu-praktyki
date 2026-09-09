from rest_framework import serializers
from .models import Sprzet

class SprzetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprzet
        fields = '__all__'  