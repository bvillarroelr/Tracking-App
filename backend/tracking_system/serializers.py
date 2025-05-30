from rest_framework import serializers
from .models import Paquete

class PaqueteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paquete
        fields = '__all__'
