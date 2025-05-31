from rest_framework import viewsets
from .models import Paquete, Usuario, Estado_entrega, Ruta
from .serializers import Estado_entregaSerializer, PaqueteSerializer, RutaSerializer, UsuarioSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

import uuid # -> para generar tokens únicos

"""
ViewSet: clase de django REST Framework que agrupa automáticamente varias vistas (endpoints)
         para un modelo en una sola clase, y gestiona operaciones CRUD automáticamente.
"""

# ViewSets para CRUD de cada modelo

class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class EstadoEntregaViewSet(viewsets.ModelViewSet):
    queryset = Estado_entrega.objects.all()
    serializer_class = Estado_entregaSerializer

class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer


# -------- REGISTRO/LOGIN DE USUARIOS --------

# NOTE: Para app móvil, login/registro usa modelo Usuario de la DB, distinto a User de Django


# -> view para registrar nuevos usuarios (mobile app)

class UserRegisterView(APIView):

    def post(self, request):
        data = request.data
        token = str(uuid.uuid4()) # -> generar token único para usuario


        usuario = Usuario.objects.create(
            usuario_nombre=data['nombre'],
            usuario_correo=data['correo'],
            usuario_tipo=data['tipo'],
            usuario_auth_token=token
        )

        return Response({'token': token}, status=status.HTTP_201_CREATED)


# -> view para login de usuarios (mobile app)

class UserLoginView(APIView):

    def post(self, request):
        correo = request.data.get('correo')
        usuario = Usuario.objects.filter(usuario_correo=correo).first()

        if usuario:
            if not usuario.usuario_auth_token:
                usuario.usuario_auth_token = str(uuid.uuid4())
                usuario.save()

            return Response({'token': usuario.usuario_auth_token})
        
        return Response({'error': 'Credenciales inválidas'}, status=400)



