# Tracking App
Aplicación móvil para el rastreo y gestión de pedidos para una empresa e-commerce, con visualización web para administradores.

# Instrucciones de uso
Este proyecto utiliza el ambiente virtual pipenv para manejar los paquetes y dependencias instaladas (Django, etc.)

En caso de no tener instalado pipenv, puedes descargarlo ejecutando este comando:

```
pip install pipenv
```
Las dependencias registradas están en el archivo Pipfile, a continuación se muestra cómo instalarlas, y cómo ejecutar el entorno virtual:

```
pipenv install 
pipenv shell
```

**IMPORTANTE: Recuerda seleccionar el intérprete del entorno vintual en tu IDE, y así evitar conflictos de versiones**

Luego, para ejecutar la app:

```
python manage.py migrate
python manage.py runserver
```





