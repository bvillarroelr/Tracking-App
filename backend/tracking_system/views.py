from rest_framework import viewsets
from .models import Paquete, Usuario, Estado_entrega, Ruta
from .serializers import Estado_entregaSerializer, PaqueteSerializer, RutaSerializer, UsuarioSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAdminUser

import uuid # -> para generar tokens únicos
from django.contrib.auth.hashers import make_password, check_password # -> para hashing y verificación de contraseñas

from datetime import datetime

"""
ViewSet: clase de django REST Framework que agrupa automáticamente varias vistas (endpoints)
         para un modelo en una sola clase, y gestiona operaciones CRUD automáticamente.
"""

# ------------ ENDPOINTS PARA ADMINISTRADORES -----------

# ViewSets para CRUD de cada modelo (para app web/admin)
# viewsets crean autimáticamente los endpoints para operaciones CRUD


class PaqueteViewSet(viewsets.ModelViewSet):
    queryset = Paquete.objects.all()
    serializer_class = PaqueteSerializer
    permission_classes = [IsAdminUser] # -> solo staff/superusers pueden acceder a estos endpoints

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class EstadoEntregaViewSet(viewsets.ModelViewSet):
    queryset = Estado_entrega.objects.all()
    serializer_class = Estado_entregaSerializer

class RutaViewSet(viewsets.ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer


# -> ENDPOINT DE PRUEBA PARA TESTEAR CONEXIÓN CON LA API

class PingView(APIView):
    def get(self, request):
        print("Ping recibido lol")
        return Response({'message': 'Correctamente conectado al backend kumpa'}, status=status.HTTP_200_OK)



# -------- ENDPOINTS REGISTRO/LOGIN DE USUARIOS APP MÓVIL --------

# NOTE: Para app móvil, login/registro usa modelo Usuario de la DB, distinto a User de Django


# -> view para registrar nuevos usuarios (mobile app)

class UserRegisterView(APIView):

    def post(self, request):
        data = request.data
        
        # -> verificación completitud de campos
        required_fields = ['nombre', 'correo', 'contrasena', 'tipo']
        for field in required_fields:
            value = data.get(field)
            if value is None or str(value).strip() == '':
                return Response({'Error': f'El campo "{field}" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)
    
        # -> verificación correo ya registrado
        if Usuario.objects.filter(usuario_correo=data['correo']).exists():
            return Response({'Error': 'El correo ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)
        

        token = str(uuid.uuid4()) # -> generar token único para usuario
        password_hash = make_password(data['contrasena']) # -> hasheo de contraseña

        usuario = Usuario.objects.create(
            usuario_nombre=data['nombre'],
            usuario_correo=data['correo'],
            usuario_tipo=data['tipo'],
            usuario_contrasena=password_hash,
            usuario_auth_token=token

        )

        return Response({'token': token}, status=status.HTTP_201_CREATED)


# -> view para login de usuarios (mobile app)

class UserLoginView(APIView):

    def post(self, request):
        correo = request.data.get('correo')
        password = request.data.get('contrasena')

        usuario = Usuario.objects.filter(usuario_correo=correo).first()

        if usuario and check_password(password, usuario.usuario_contrasena):
            if not usuario.usuario_auth_token:
                usuario.usuario_auth_token = str(uuid.uuid4())
                usuario.save()

            return Response({'token': usuario.usuario_auth_token})
        
        return Response({'error': 'Credenciales inválidas'}, status=400)


# ------------ ENDPOINTS PAQUETES ------------

# -> endpoint para registrar un nuevo paquete

# TODO: usuario asociado a paquete es el remitente o destinatario? por ahora se asumirá como remitente, modificar/revisar luego
class PaqueteRegisterView(APIView):
 
    # -> desactiva autenticación por defecto de Django REST
    authentication_classes = [] 

    # -> permitir acceso a cualquier usuario (ya que se está usando token personalizado, no el de Django REST Framework)
    permission_classes = [AllowAny] 
    
    # -> método POST para registro de paquetes
    def post(self, request):
        token = request.headers.get('Authorization', '').replace('token ', '')
        usuario = Usuario.objects.filter(usuario_auth_token=token).first()
        
        print(f"Token recibido: {token}")

        if not usuario:
            return Response({'error': 'Token inválido'}, status=401)
        
        data = request.data

        # -> validación completitud de campos
        required_fields = ['peso', 'dimensiones']
        for field in required_fields:
            value = data.get(field)
            if value is None or str(value).strip() == '':
                return Response({'error', f'El campo "{field}" es obligatorio.'}, status=400)
        
        
        estado_inicial = Estado_entrega.objects.filter(estado_nombre='En preparación').first()
        if not estado_inicial:
            return Response({'error': 'No se encontró el estado "En preparación'}, status=500)

        # -> registrar paquete
        paquete = Paquete.objects.create(
            usuario=usuario,
            paquete_peso=data['peso'],
            paquete_dimensiones=data['dimensiones'],
            paquete_fecha_envio=data.get('fecha_envio', datetime.now().replace(microsecond=0)),
            estado=estado_inicial
        )

        return Response({'message': 'Paquete registrado exitosamente', 'paquete_id': paquete.paquete_id}, status=201)
    
# -> endpoint para listar todos los paquetes de un usuario

class PaqueteListView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.headers.get('Authorization', '').replace('token ', '')
        usuario = Usuario.objects.filter(usuario_auth_token=token).first()

        print(f"Token recibido: {token}")

        if not usuario:
            return Response({'error': 'Token inválido'}, status=401)
    
        paquetes = Paquete.objects.filter(usuario=usuario).order_by('paquete_id') # -> se ordenan por ID (ascendente)
        data = [
            {
                'id': paquete.paquete_id,
                'peso': paquete.paquete_peso,
                'dimensiones': paquete.paquete_dimensiones,
                'fecha_envio': paquete.paquete_fecha_envio,
                'estado': paquete.estado.estado_nombre
            }
            for paquete in paquetes
        ]

        return Response(data)


# -> endpoint para obtener detalles de un paquete específico

class PaqueteDetailView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    
    def get(self, request, id):
        token = request.headers.get('Authorization', '').replace('token ', '')
        usuario = Usuario.objects.filter(usuario_auth_token=token).first()
 
        print(f"Token recibido: {token}")

        if not usuario:
            return Response({'error': 'Token inválido'}, status=401)

        paquete = Paquete.objects.filter(paquete_id=id, usuario=usuario).first()
        if not paquete:
            return Response({'error': 'Paquete no encontrado'}, status=404)
        
        data = {
            'id': paquete.paquete_id,
            'peso': paquete.paquete_peso,
            'dimensiones': paquete.paquete_dimensiones,
            'fecha_envio': paquete.paquete_fecha_envio,
            'estado': paquete.estado.estado_nombre,
            'ruta': {
                'origen': paquete.ruta.ruta_origen if paquete.ruta else None,
                'destino': paquete.ruta.ruta_destino if paquete.ruta else None,
                'distancia_km': paquete.ruta.ruta_distancia_km if paquete.ruta else None,
                'duracion_estimada_min': paquete.ruta.ruta_duracion_estimada_min if paquete.ruta else None
            }

        }
        
        return Response(data, status=200)



