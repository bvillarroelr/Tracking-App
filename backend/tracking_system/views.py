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
from django.utils import timezone

from django.conf import settings
import requests
import json

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


# -> NOTE: este viewset es para usuarios conductores, no clientes. Admins registran conductores acá
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser] # -> solo staff/superusers pueden acceder a estos endpoints

    def get_queryset(self):
        return Usuario.objects.filter(usuario_tipo='conductor') # -> filtrar solo conductores

    # -> método para crear un nuevo usuario conductor
    def create(self, request, *args, **kwargs):
        print("DATA RECIBIDA:", request.data)


        data = request.data

        # -> verificación completitud de campos
        required_fields = ['usuario_nombre', 'usuario_apellido', 'usuario_correo', 'usuario_contrasena']
        for field in required_fields:
            value = data.get(field)
            if value is None or str(value).strip() == '':
                return Response({'Error': f'El campo "{field}" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

        # -> verificación correo ya registrado
        if Usuario.objects.filter(usuario_correo=data['usuario_correo']).exists():
            return Response({'Error': 'El correo ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)

        token = str(uuid.uuid4()) # -> generar token único para usuario
        password_hash = make_password(data['usuario_contrasena'])  # -> hasheo de contraseña
        
        # -> creación usuario conductor
        usuario = Usuario.objects.create(
            usuario_nombre=data['usuario_nombre'],
            usuario_apellido=data['usuario_apellido'],
            usuario_correo=data['usuario_correo'],
            usuario_contrasena=password_hash,
            usuario_tipo='conductor',  # -> tipo conductor
            usuario_auth_token=token
        )

        # -> serializar el usuario creado
        serializer = self.get_serializer(usuario)
        return Response({'token': token, 'usuario': serializer.data}, status=status.HTTP_201_CREATED)

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
        required_fields = ['nombre', 'apellido' , 'correo', 'contrasena', 'tipo']
        for field in required_fields:
            value = data.get(field)
            if value is None or str(value).strip() == '':
                return Response({'Error': f'El campo "{field}" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)
    
        # -> verificación correo ya registrado
        if Usuario.objects.filter(usuario_correo=data['correo']).exists():
            return Response({'Error': 'El correo ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)
        

        token = str(uuid.uuid4()) # -> generar token único para usuario
        password_hash = make_password(data['contrasena']) # -> hasheo de contraseña

        # -> creación usuario cliente
        usuario = Usuario.objects.create(
            usuario_nombre=data['nombre'],
            usuario_apellido=data['apellido'],
            usuario_correo=data['correo'],
            usuario_tipo=data['tipo'],
            usuario_contrasena=password_hash,
            usuario_auth_token=token

        )

        return Response({'token': token}, status=status.HTTP_201_CREATED)


# -> view para login de usuarios, clientes y conductores (mobile app)

class UserLoginView(APIView):

    def post(self, request):
        correo = request.data.get('correo')
        password = request.data.get('contrasena')

        usuario = Usuario.objects.filter(usuario_correo=correo).first()

        if usuario and check_password(password, usuario.usuario_contrasena):
            if not usuario.usuario_auth_token:
                usuario.usuario_auth_token = str(uuid.uuid4())
                usuario.save()

            return Response({
                'token': usuario.usuario_auth_token,
                'tipo': usuario.usuario_tipo, # -> tipo de usuario (cliente o conductor)
                'nombre': usuario.usuario_nombre,
            })
        
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
        required_fields = ['peso', 'dimensiones', 'destino']
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
            paquete_descripcion=data['descripcion'] if 'descripcion' in data else '',
            paquete_fecha_envio=data.get('fecha_envio', timezone.now().replace(microsecond=0)),
            paquete_destino=data.get('destino', ''),
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
                'nombre': paquete.usuario.usuario_nombre,
                'apellido': paquete.usuario.usuario_apellido,
                'descripcion': paquete.paquete_descripcion,
                'destino': paquete.paquete_destino,
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


# endpoint para obtener todos los paquetes que tengan una ruta asociada (para conductores)

class PaquetesConRutaView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.headers.get('Authorization', '').replace('token ', '')
        usuario = Usuario.objects.filter(usuario_auth_token=token).first()

        print(f"Token recibido: {token}")

        if not usuario:
            return Response({'error': 'Token inválido'}, status=401)

        # Si deseas que solo se muestren los paquetes asignados a rutas donde este usuario es responsable, agrega filtro por usuario aquí

        paquetes_con_ruta = Paquete.objects.filter(ruta__isnull=False).order_by('paquete_id')

        data = [
                {
                    'paquete_id': paquete.paquete_id,
                    'usuario_nombre': paquete.usuario.usuario_nombre,
                    'usuario_apellido': paquete.usuario.usuario_apellido,
                    'usuario_correo': paquete.usuario.usuario_correo,
                    'paquete_destino': paquete.paquete_destino,
                    'paquete_peso': paquete.paquete_peso,
                    'paquete_descripcion': paquete.paquete_descripcion,
                    'estado_nombre': paquete.estado.estado_nombre if paquete.estado else 'Sin estado'
                    }
                for paquete in paquetes_con_ruta
                ]

        return Response(data, status=status.HTTP_200_OK)

# endpoint para generar una ruta entre origen y destino usando Google Maps API

class GenerarRutaView(APIView):
    def post(self, request, paquete_id):
        print(f"APi KEY: {settings.GOOGLE_MAPS_API_KEY}")
        print(f"Generando ruta para paquete ID: {paquete_id}")

        try:
            paquete = Paquete.objects.get(paquete_id=paquete_id)
        except Paquete.DoesNotExist:
            return Response({'error': 'Paquete no encontrado'}, status=404)

        # NOTE: POR SIMPLICIDAD PREMATURA, POR AHORA SE ASUMIRA QUE TODAS LOS DESTINOS ESTÁN EN CONCEPCIÓN, CHILE
        destino_texto = paquete.paquete_destino
        destino_texto = destino_texto.strip() + ", Concepción, Chile"

        # -> se asumen coordenadas fijas de origen para simplificar (UDEC)
        origen = {
                'latLng': {
                    'latitude': -36.8263,  # Latitud de UDEC
                    'longitude': -73.0493  # Longitud de UDEC
                    }
                }

        # -> geocodificar destino
        print(f"Geocodificando destino: {destino_texto}")
        geocode_url = "https://maps.googleapis.com/maps/api/geocode/json"
        geocode_params = {
                "address": destino_texto,
                "key": settings.GOOGLE_MAPS_API_KEY
                }

        geocode_resp = requests.get(geocode_url, params=geocode_params)
        if geocode_resp.status_code != 200:
            return Response({'error': 'Error al geocodificar destino'}, status=500)

        geocode_data = geocode_resp.json()
        print("Respuesta de geocode:", json.dumps(geocode_data, indent=2))
        if not geocode_data["results"]:
            return Response({'error': 'Dirección destino no encontrada'}, status=400)

        destino_coords = geocode_data["results"][0]["geometry"]["location"]

        origen_lat = origen['latLng']['latitude']
        origen_lng = origen['latLng']['longitude']
        destino_lat = destino_coords['lat']
        destino_lng = destino_coords['lng']

        # Paso 2: calcular ruta
        ruta_url = "https://routes.googleapis.com/directions/v2:computeRoutes"
        headers = {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": settings.GOOGLE_MAPS_API_KEY,
                "X-Goog-FieldMask": "routes.polyline.encodedPolyline,routes.distanceMeters,routes.duration"
                }

        data = {
                "origin": {
                    "location": {
                        "latLng": {
                            "latitude": origen_lat,
                            "longitude": origen_lng
                            }
                        }
                    },
                "destination": {
                    "location": {
                        "latLng": {
                            "latitude": destino_lat,
                            "longitude": destino_lng
                            }
                        }
                    },
                "travelMode": "DRIVE"
        }


        ruta_resp = requests.post(ruta_url, json=data, headers=headers)
        print("Status ruta:", ruta_resp.status_code)
        print("Respuesta ruta:", ruta_resp.text)
       
        if ruta_resp.status_code != 200:
            return Response({'error': 'Error consultando ruta'}, status=500)

        ruta_data = ruta_resp.json()

        if not ruta_data.get("routes"):
            return Response({'error': 'No se encontró una ruta válida'}, status=400)

        ruta = ruta_data["routes"][0]
        polyline = ruta["polyline"]["encodedPolyline"]
        distancia_m = ruta["distanceMeters"]
        duracion_str = ruta["duration"]  # p. ej. "1234s"
        duracion_min = int(int(duracion_str.replace("s", "")) / 60)

        # -> crear nueva ruta
        nueva_ruta = Ruta.objects.create(
                ruta_origen="UDEC (-36.8263, -73.0493)",
                ruta_destino=destino_texto,
                ruta_destino_latitud=destino_lat,
                ruta_destino_longitud=destino_lng,
                ruta_distancia_km=round(distancia_m / 1000, 2),
                ruta_duracion_estimada_min=duracion_min
                )

        # -> asociar nueva ruta al paquete
        paquete.ruta = nueva_ruta
        paquete.save()

        return Response({
            "mensaje": "Ruta generada correctamente",
            "ruta_id": nueva_ruta.ruta_id,
            "polyline": polyline,
            "distancia_km": nueva_ruta.ruta_distancia_km,
            "duracion_min": nueva_ruta.ruta_duracion_estimada_min
            })
