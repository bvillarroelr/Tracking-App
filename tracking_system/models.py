from django.db import models

# Create your models here.
class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(max_length=254)
    
class Estado_entrega(models.Model):
    fecha_ultimo_cambio = models.DateField(auto_now=True) # agregar al modelo
    hora_ultimo_cambio = models.DateTimeField(auto_now=True)   # agregar al modelo
    estado = models.CharField(max_length=30)

class Ruta(models.Model):
    distancia_km = models.FloatField()

class Paquete(models.Model):
    peso = models.FloatField()
    dir_origen = models.CharField(max_length=200)   # se movió Ruta a Paquete (cambiar en los modelos de diseño)
    dir_destino = models.CharField(max_length=200)  # se movió Ruta a Paquete (cambiar en los modelos de diseño)
    fecha_envio = models.DateField(auto_now_add=True)
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE) #fk a Ruta
    estado = models.ForeignKey(Estado_entrega, on_delete=models.CASCADE) #fk a Estado_entrega
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE) #fk a Usuario



