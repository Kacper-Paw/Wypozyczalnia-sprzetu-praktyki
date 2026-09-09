from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

#serializer do Logowania – dorzuca rolę i login
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Określenie roli (np. admin vs zwykły użytkownik)
        role = 'admin' if self.user.is_staff else 'user'
        
        
        data['username'] = self.user.username
        data['role'] = role
        
        return data


# serializer do rejestracji
class RejestracjaSerializer(serializers.ModelSerializer):
    powtorz_haslo = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'powtorz_haslo']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['powtorz_haslo']:
            raise serializers.ValidationError({"powtorz_haslo": "Hasła nie są takie same."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('powtorz_haslo')
        # Domyślnie tworzy konto ze zwykłą rolą użytkownika
        return User.objects.create_user(**validated_data)