from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def rejestracja(request):

    login = request.data.get('login')
    haslo = request.data.get('haslo')
    email = request.data.get('email')
    powtorz_haslo = request.data.get('powtorz_haslo')

    # Warunki rejestracji

    if not all([login, haslo, email, powtorz_haslo]):
        return Response({'error': 'Wszystkie pola są wymagane.'}, status=status.HTTP_400_BAD_REQUEST)

    if haslo != powtorz_haslo:
        return Response({'error': 'Hasła nie są zgodne.'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=login).exists():
        return Response({'error': 'Użytkownik o podanym loginie już istnieje.'}, status=status.HTTP_400_BAD_REQUEST)    

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Użytkownik o podanym emailu już istnieje.'}, status=status.HTTP_400_BAD_REQUEST)    

    # utworzenie użytkownika
    User.objects.create_user(username=login, password=haslo, email=email)
    return Response({'message': 'Rejestracja zakończona sukcesem.'}, status=status.HTTP_201_CREATED)