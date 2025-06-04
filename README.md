# Tracking App
Aplicación móvil para el rastreo y gestión de pedidos para una empresa e-commerce, con visualización web para administradores.

# Back-end
Se debe utilizar el ambiente virtual pipenv para manejar los paquetes y dependencias instaladas (Django principalmente)

En caso de no tener instalado pipenv, puedes descargarlo ejecutando este comando:

```
pip install pipenv
```
Las dependencias registradas están en el archivo Pipfile, para instalarlas, se debe ejectuar el siguiente comando:

```
pipenv install 
```

**IMPORTANTE: Recuerda seleccionar el intérprete del entorno vintual en tu IDE, y así evitar conflictos de versiones**

Luego, para ejecutar la app **dentro del entorno virtual**:

```
pipenv shell
python manage.py migrate
python manage.py runserver
```

# Front-end
Se debe tener instalado Node.js y React

En caso de ser primera vez que se ejecuta el front
```
npm install
```

Luego
```
npm start
```

(Recordar que corre en localhost:3000, a diferencia de Django que es en localhost:8000)
# Mobile
Se usa React Native junto con Expo.

Se debe tener previamente instalado Expo CLI. Si no se tiene: 

```
npm install -g expo-cli
```

O bien con yarn:

```
yarn global add expo-cli
```

Para instalar las dependencias de la aplicación móvil, desde la raíz del proyecto:

```
cd mobile_app

npm install
#o
yarn install
```

Previo a ejecutar la aplicación, se debe editar el archivo './mobile_app/api/index.js' y cambiar la URL a la IP local del PC donde se esté ejecutando el backend:

```javascript

const BASE_URL = "http://<IP_LOCAL>:8000/api/"; 
```

Para ejecutar la aplicación móvil, desde la raíz del proyecto:

```
cd mobile_app

npx expo start
```

Aparecerá un código QR en la terminal, el cual se debe escanear con la aplicación Expo Go instalada en el dispositivo móvil.

**NOTA**: Tanto el dispositivo móvil como el PC deben estar conectados a la misma red WiFi.

Finalmente, para levantar el backend al que se conectará la aplicación móvil, se debe ejecutar el siguiente comando en una terminal diferente,
y estando previamente dentro del entorno virtual de pipenv:

(desde raíz del proyecto):
```
cd backend

python manage.py runserver 0.0.0.0:8000
```


