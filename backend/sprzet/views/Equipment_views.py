from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q

from ..models import Sprzet, Wypozyczenie
from ..serializers import SprzetSerializer, SprzetDetailSerializer


@api_view(['GET'])
def lista_sprzetu(request):
    sprzet = Sprzet.objects.all()

    # Wyciągamy parametry wyszukiwania z zapytania Angulara
    dostepnosc = request.query_params.get('dostepnosc', None)
    search = request.query_params.get('search', None)

    # 1. Filtrowanie po dostępności
    if dostepnosc is not None and dostepnosc != '':
        is_available = dostepnosc.lower() == 'true'
        sprzet = sprzet.filter(dostepnosc=is_available)

    # 2. Wyszukiwanie po nazwie lub kategorii
    if search:
        sprzet = sprzet.filter(
            Q(nazwa__icontains=search) | Q(kategoria__icontains=search)
        )

    serializer = SprzetSerializer(sprzet, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wypozycz_sprzet(request):
    user = request.user

    # Sprawdzamy limit max 3 aktywnych wypożyczeń dla użytkownika
    aktywne_wypozyczenia = Wypozyczenie.objects.filter(uzytkownik=user, data_zwrotu__isnull=True).count()
    if aktywne_wypozyczenia >= 3:
        return Response(
            {'detail': 'Osiągnięto limit! Nie możesz posiadać więcej niż 3 aktywne wypożyczenia jednocześnie.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    sprzet_id = request.data.get('sprzet')
    planowana_data = request.data.get('planowana_data_zwrotu')

    try:
        sprzet = Sprzet.objects.get(id=sprzet_id)
    except Sprzet.DoesNotExist:
        return Response({'detail': 'Nie znaleziono wskazanego sprzętu.'}, status=status.HTTP_404_NOT_FOUND)

    if not sprzet.dostepnosc:
        return Response({'detail': 'Ten sprzęt jest już wypożyczony!'}, status=status.HTTP_400_BAD_REQUEST)

    sprzet.dostepnosc = False
    sprzet.save()

    Wypozyczenie.objects.create(
        uzytkownik=user,
        sprzet=sprzet,
        planowana_data_zwrotu=planowana_data
    )

    return Response({'detail': 'Pomyślnie wypożyczono sprzęt!'}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def szczegoly_sprzetu(request, pk):
    try:
        sprzet = Sprzet.objects.get(pk=pk, is_wycofany=False)
    except Sprzet.DoesNotExist:
        return Response({'detail': 'Nie znaleziono sprzętu.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SprzetDetailSerializer(sprzet, context={'request': request})
    return Response(serializer.data)