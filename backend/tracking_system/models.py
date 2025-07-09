from django.db import models

class Estado_entrega(models.Model):
    estado_id = models.AutoField(primary_key=True)
    estado_nombre = models.CharField(unique=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'estado_entrega'


class Paquete(models.Model):
    paquete_id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING, to_field='usuario_id')
    ruta = models.ForeignKey('Ruta', models.DO_NOTHING, to_field='ruta_id', blank=True, null=True)
    estado = models.ForeignKey('Estado_entrega', models.DO_NOTHING, to_field='estado_id', blank=True, null=True)
    paquete_peso = models.FloatField()
    paquete_dimensiones = models.TextField(blank=True, null=True)
    paquete_descripcion = models.TextField(blank=True, null=True)
    paquete_fecha_envio = models.DateTimeField(blank=True, null=True)  
    paquete_destino = models.TextField()

    class Meta:
        managed = False
        db_table = 'paquete'


class Ruta(models.Model):
    ruta_id = models.AutoField(primary_key=True)
    ruta_origen = models.TextField(null=True, blank=True)
    ruta_destino = models.TextField(null=True, blank=True)
    ruta_destino_latitud = models.FloatField(null=True, blank=True)
    ruta_destino_longitud = models.FloatField(null=True, blank=True)
    ruta_distancia_km = models.FloatField(null=True, blank=True)
    ruta_duracion_estimada_min = models.IntegerField(null=True, blank=True)
    ruta_polyline = models.TextField(blank=True, null=True) 
    class Meta:
        db_table = 'ruta'


TIPO_USUARIO = [
    ('cliente', 'Cliente'),
    ('conductor', 'Conductor'),
]


class Usuario(models.Model):
    usuario_id = models.AutoField(primary_key=True)
    usuario_nombre = models.CharField(max_length=100)
    usuario_apellido = models.CharField(max_length=100)
    usuario_correo = models.EmailField(unique=True, max_length=254)
    usuario_tipo = models.CharField(max_length=20, choices=TIPO_USUARIO, default='cliente')
    usuario_fecha_registro = models.DateTimeField(auto_now_add=True)  
    usuario_contrasena = models.CharField(max_length=128) # -> almacenar hash de la contraseña

    # token autenticación para la app móvil
    usuario_auth_token = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'

