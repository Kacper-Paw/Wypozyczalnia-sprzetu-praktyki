from django.db import transaction  # pyright: ignore[reportMissingModuleSource]
from django.utils import timezone  # pyright: ignore[reportMissingModuleSource]
from rest_framework import status  # pyright: ignore[reportMissingImports]
from rest_framework.decorators import api_view, permission_classes  # pyright: ignore[reportMissingImports]
from rest_framework.permissions import IsAdminUser  # pyright: ignore[reportMissingImports]
from rest_framework.response import Response  # pyright: ignore[reportMissingImports]

from ..models import Sprzet, Wypozyczenie  # pyright: ignore[reportMissingImports]
from ..serializers.Equipment_serializers import SprzetSerializer  # pyright: ignore[reportMissingImports]


# SEKCJA 1: ZARZĄDZANIE SPRZĘTEM

# Lista całego sprzętu (w tym wycofanego)
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_lista_sprzetu(request):
    sprzety = Sprzet.objects.all()
    serializer = SprzetSerializer(sprzety, many=True)
    return Response(serializer.data)


# Dodawanie sprzętu
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_dodaj_sprzet(request):
    serializer = SprzetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(dostepnosc=True, is_wycofany=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # Jeśli nr_inwentarzowy powtarza się, DRF zwróci czytelny błąd przy polu
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Edycja sprzętu
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def admin_edytuj_sprzet(request, pk):
    try:
        sprzet = Sprzet.objects.get(pk=pk)
    except Sprzet.DoesNotExist:
        return Response({'detail': 'Sprzęt nie istnieje.'}, status=status.HTTP_404_NOT_FOUND)

    serializer = SprzetSerializer(sprzet, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Wycofanie sprzętu (tylko dostępnego)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_wycofaj_sprzet(request, pk):
    try:
        sprzet = Sprzet.objects.get(pk=pk)
    except Sprzet.DoesNotExist:
        return Response({'detail': 'Sprzęt nie istnieje.'}, status=status.HTTP_404_NOT_FOUND)

    if not sprzet.dostepnosc:
        return Response(
            {'detail': 'Wycofać można tylko dostępny przedmiot — wypożyczony trzeba najpierw zwrócić.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    sprzet.is_wycofany = True  # Zwrot sprzętu
    sprzet.save()
    return Response({'detail': 'Przedmiot został wycofany z katalogu.'})



# SEKCJA 2: ZARZĄDZANIE WYPOŻYCZENIAMI

# Lista wszystkich wypożyczeń z filtrowaniem
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_lista_wypozyczen(request):
    filtr = request.query_params.get('status')  # 'aktywne' lub 'po_terminie'
    dzisiaj = timezone.now().date()

    wypozyczenia = Wypozyczenie.objects.select_related('uzytkownik', 'sprzet').all()

    if filtr == 'aktywne':
        wypozyczenia = wypozyczenia.filter(data_zwrotu__isnull=True)
    elif filtr == 'po_terminie':
        wypozyczenia = wypozyczenia.filter(data_zwrotu__isnull=True, planowana_data_zwrotu__lt=dzisiaj)

    dane = []
    for w in wypozyczenia:
        # Określamy stan
        if w.data_zwrotu is not None:
            stan = 'zakończone'
        elif w.planowana_data_zwrotu < dzisiaj:
            stan = 'po terminie'
        else:
            stan = 'aktywne'

        dane.append({
            'id': w.id,
            'uzytkownik_email': w.uzytkownik.email,
            'sprzet_nazwa': w.sprzet.nazwa,
            'nr_inwentarzowy': w.sprzet.nr_inwentarzowy,  
            'data_wypozyczenia': w.data_wypozyczenia,
            'planowana_data_zwrotu': w.planowana_data_zwrotu,
            'data_zwrotu': w.data_zwrotu,
            'stan': stan,
        })

    return Response(dane)


# Transakcyjne potwierdzenie zwrotu
@api_view(['POST'])
@permission_classes([IsAdminUser])
@transaction.atomic
def admin_potwierdz_zwrot(request, wypozyczenie_id):
    try:
        wypozyczenie = Wypozyczenie.objects.select_for_update().get(pk=wypozyczenie_id)
    except Wypozyczenie.DoesNotExist:
        return Response({'detail': 'Wypożyczenie nie istnieje.'}, status=status.HTTP_404_NOT_FOUND)

    if wypozyczenie.data_zwrotu is not None: # Is not none: sprawdza, czy dany obiekt ma jakąś wartość i nie jest pustymwskaźnikiem
        return Response({'detail': 'To wypożyczenie jest już zakończone.'}, status=status.HTTP_400_BAD_REQUEST)

    # Jedna atomowa operacja
    wypozyczenie.data_zwrotu = timezone.now().date()
    wypozyczenie.save()

    sprzet = wypozyczenie.sprzet
    sprzet.dostepnosc = True
    sprzet.save()

    return Response({'detail': 'Zwrot został pomyślnie potwierdzony, sprzęt wraca do katalogu.'})