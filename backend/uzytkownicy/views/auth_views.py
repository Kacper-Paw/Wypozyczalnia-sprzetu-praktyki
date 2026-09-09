from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from ..serializers import CustomTokenObtainPairSerializer, RejestracjaSerializer

# Widok logowania zwracający tokeny oraz rolę
class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Widok rejestracji
@api_view(['POST'])
@permission_classes([AllowAny])
def rejestracja_view(request):
    serializer = RejestracjaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Użytkownik został zarejestrowany.'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)