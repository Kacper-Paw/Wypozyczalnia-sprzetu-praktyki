from rest_framework.decorators import api_view
from rest_framework.response import Response

from ..models import Sprzet
from ..serializers import SprzetSerializer


@api_view(['GET'])
def lista_sprzetu(request):
    sprzet = Sprzet.objects.all()
    serializer = SprzetSerializer(sprzet, many=True)

    return Response(serializer.data)
