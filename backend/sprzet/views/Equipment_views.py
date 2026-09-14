from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ..models import Sprzet, Wypozyczenie
from ..serializers import SprzetSerializer


@api_view(['GET'])
def lista_sprzetu(request):
    sprzet = Sprzet.objects.all()
    serializer = SprzetSerializer(sprzet, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wypozycz_sprzet(request):
    user = request.user

    # 1. Sprawdzamy limit max 3 aktywnych wypożyczeń dla użytkownika
    aktywne_wypozyczenia = Wypozyczenie.objects.filter(uzytkownik=user, data_zwrotu__isnull=True).count()
    if aktywne_wypozyczenia >= 3:
        return Response(
            {'detail': 'Osiągnięto limit! Nie możesz posiadać więcej niż 3 aktywne wypożyczenia jednocześnie.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2. Pobieramy dane z żądania Angulara
    sprzet_id = request.data.get('sprzet')
    planowana_data = request.data.get('planowana_data_zwrotu')

    try:
        sprzet = Sprzet.objects.get(id=sprzet_id)
    except Sprzet.DoesNotExist:
        return Response({'detail': 'Nie znaleziono wskazanego sprzętu.'}, status=status.HTTP_404_NOT_FOUND)

    if not sprzet.dostepnosc:
        return Response({'detail': 'Ten sprzęt jest już wypożyczony!'}, status=status.HTTP_400_BAD_REQUEST)

    # 3. Zmieniamy dostępność sprzętu i tworzmy rekord wypożyczenia
    sprzet.dostepnosc = False
    sprzet.save()

    Wypozyczenie.objects.create(
        uzytkownik=user,
        sprzet=sprzet,
        planowana_data_zwrotu=planowana_data
    )

    return Response({'detail': 'Pomyślnie wypożyczono sprzęt!'}, status=status.HTTP_201_CREATED)