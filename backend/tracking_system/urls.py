from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PaqueteViewSet, EstadoEntregaViewSet, UsuarioViewSet, RutaViewSet

from .views import UserRegisterView, UserLoginView, PingView, PaqueteRegisterView

# router registra los viewsets creados y crea automáticamente las rutas para ellos.
# con esto ya se pueden usar los endpoints desde por ejemplo la app móvil
router = DefaultRouter()
router.register(r'paquetes', PaqueteViewSet)
router.register(r'usuarios', UsuarioViewSet)
router.register(r'estados_entrega', EstadoEntregaViewSet)
router.register(r'rutas', RutaViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path('register/', UserRegisterView.as_view(), name='registro_usuario'),
    path('login/', UserLoginView.as_view(), name='login_usuario'),

    path('ping/', PingView.as_view(), name='ping'),

    path('registrar_paquete/', PaqueteRegisterView.as_view(), name='registrar_paquete'),
]
