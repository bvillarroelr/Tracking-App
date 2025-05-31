from rest_framework import viewsets
from .models import Paquete
from .serializers import PaqueteSerializer

class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer
