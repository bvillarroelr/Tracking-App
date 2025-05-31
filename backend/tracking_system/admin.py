from .models import Paquete, Usuario, Estado_entrega, Ruta
from django.contrib import admin


admin.site.register(Paquete)
admin.site.register(Usuario)
admin.site.register(Estado_entrega)
admin.site.register(Ruta)

