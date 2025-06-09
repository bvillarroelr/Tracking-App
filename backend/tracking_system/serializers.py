from rest_framework import serializers
from .models import Paquete, Usuario, Estado_entrega, Ruta

class PaqueteSerializer(serializers.ModelSerializer):
    estado_nombre = serializers.CharField(source='estado.estado_nombre', read_only=True)    
    usuario_nombre = serializers.CharField(source='usuario.usuario_nombre', read_only=True)


    class Meta:
        model = Paquete
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class Estado_entregaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado_entrega
        fields = '__all__'

class RutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ruta
        fields = '__all__'


