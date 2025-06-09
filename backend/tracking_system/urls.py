from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaqueteViewSet, EstadoEntregaViewSet, UsuarioViewSet, RutaViewSet

from .views import UserRegisterView, UserLoginView, PingView, PaqueteRegisterView, PaqueteListView, PaqueteDetailView

from .views import GenerarRutaView

# router registra los viewsets creados y crea automáticamente las rutas para ellos.
# con esto ya se pueden usar los endpoints desde por ejemplo la app móvil
router = DefaultRouter()

# NOTE: Actualmente no se está usando router, se están usando vistas específicas para cada endpoint (con APIView), 
# por lo tanto si se descomentan, el router y las vistas personalizadas con APIView entran en conflicto.
# Quizá router con viewsets puedan tener utilidad futura (ej: para admins en la app web), y así se separa de los endpoints
# manuales con los que se comunica la app móvil (también habría que cambiar las rutas a ej: r'paquetes-admin')

# router.register(r'paquetes', PaqueteViewSet)
# router.register(r'usuarios', UsuarioViewSet)
# router.register(r'estados_entrega', EstadoEntregaViewSet)
# router.register(r'rutas', RutaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path('register/', UserRegisterView.as_view(), name='registro_usuario'),
    path('login/', UserLoginView.as_view(), name='login_usuario'),

    path('ping/', PingView.as_view(), name='ping'),

    path('paquetes/registrar_paquete/', PaqueteRegisterView.as_view(), name='registrar_paquete'),
    path('paquetes/listar_paquetes/', PaqueteListView.as_view(), name='listar_paquetes'),
    path('paquetes/<int:id>/', PaqueteDetailView.as_view(), name='detalle_paquete'),

    path('generar_ruta/', GenerarRutaView.as_view(), name='generar_ruta'),

]
