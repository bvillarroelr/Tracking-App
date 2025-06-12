from django.db import models

"""
# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    first_name = models.CharField(max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class AuthtokenToken(models.Model):
    key = models.CharField(primary_key=True, max_length=40)
    created = models.DateTimeField()
    user = models.OneToOneField(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'authtoken_token'


class DjangoAdminLog(models.Model):
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    action_time = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class EstadoEntrega(models.Model):
    estado_id = models.AutoField(primary_key=True, blank=True, null=True)
    estado_nombre = models.TextField(unique=True)

    class Meta:
        managed = False
        db_table = 'estado_entrega'


class Paquete(models.Model):
    paquete_id = models.AutoField(primary_key=True, blank=True, null=True)
    usuario = models.ForeignKey('Usuario', models.DO_NOTHING)
    ruta = models.ForeignKey('Ruta', models.DO_NOTHING, blank=True, null=True)
    estado = models.ForeignKey(EstadoEntrega, models.DO_NOTHING, blank=True, null=True)
    paquete_peso = models.FloatField()
    paquete_dimensiones = models.TextField()
    paquete_descripcion = models.TextField(blank=True, null=True)
    paquete_fecha_envio = models.TextField(blank=True, null=True)  # This field type is a guess.
    paquete_destino = models.TextField()

    class Meta:
        managed = False
        db_table = 'paquete'


class Ruta(models.Model):
    ruta_id = models.AutoField(primary_key=True, blank=True, null=True)
    ruta_origen = models.TextField()
    ruta_destino = models.TextField()
    ruta_distancia_km = models.FloatField()
    ruta_duracion_estimada_min = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'ruta'


class TrackingSystemEstadoEntrega(models.Model):
    fecha_ultimo_cambio = models.DateField()
    hora_ultimo_cambio = models.DateTimeField()
    estado = models.CharField(max_length=30)

    class Meta:
        managed = False
        db_table = 'tracking_system_estado_entrega'


class TrackingSystemPaquete(models.Model):
    peso = models.FloatField()
    dir_origen = models.CharField(max_length=200)
    dir_destino = models.CharField(max_length=200)
    fecha_envio = models.DateField()
    estado = models.ForeignKey(TrackingSystemEstadoEntrega, models.DO_NOTHING)
    ruta = models.ForeignKey('TrackingSystemRuta', models.DO_NOTHING)
    usuario = models.ForeignKey('TrackingSystemUsuario', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'tracking_system_paquete'


class TrackingSystemRuta(models.Model):
    distancia_km = models.FloatField()

    class Meta:
        managed = False
        db_table = 'tracking_system_ruta'


class TrackingSystemUsuario(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.CharField(max_length=254)

    class Meta:
        managed = False
        db_table = 'tracking_system_usuario'


class Usuario(models.Model):
    usuario_id = models.AutoField(primary_key=True, blank=True, null=True)
    usuario_nombre = models.TextField()
    usuario_apellido = models.TextField()
    usuario_correo = models.TextField(unique=True)
    usuario_tipo = models.TextField()
    usuario_fecha_registro = models.TextField(blank=True, null=True)  # This field type is a guess.
    usuario_contrasena = models.TextField()
    usuario_auth_token = models.TextField(unique=True, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'usuario'
"""


################# ACTUALIZACIÓN DE MODELOS #################

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
    ruta_origen = models.TextField()
    ruta_destino = models.TextField()
    ruta_destino_latitud = models.FloatField(null=True, blank=True)
    ruta_destino_longitud = models.FloatField(null=True, blank=True)
    ruta_distancia_km = models.FloatField()

    ruta_duracion_estimada_min = models.IntegerField()

    class Meta:
        managed = False
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

