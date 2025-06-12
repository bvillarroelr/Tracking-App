-- Habilitar claves foráneas en SQLite

PRAGMA foreign_keys = ON;

-- Tabla de Usuarios

CREATE TABLE usuario (
    usuario_id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_nombre TEXT NOT NULL,
    usuario_apellido TEXT NOT NULL,
    usuario_correo TEXT UNIQUE NOT NULL,
    usuario_tipo TEXT NOT NULL CHECK (usuario_tipo IN ('cliente', 'conductor')),
    usuario_fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_contrasena TEXT NOT NULL,


    usuario_auth_token TEXT UNIQUE
);

-- Tabla de Estados de Entrega

CREATE TABLE estado_entrega (
    estado_id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado_nombre TEXT UNIQUE NOT NULL
);

-- Tabla de Rutas

CREATE TABLE ruta (
    ruta_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ruta_origen TEXT NOT NULL,
    ruta_destino TEXT NOT NULL,
    ruta_destino_latitud REAL NOT NULL,
    ruta_destino_longitud REAL NOT NULL,

    ruta_distancia_km REAL NOT NULL,
    ruta_duracion_estimada_min INTEGER NOT NULL
);

-- Tabla de Paquetes

CREATE TABLE paquete (
    paquete_id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    ruta_id INTEGER,
    estado_id INTEGER,
    paquete_peso REAL NOT NULL,
    paquete_dimensiones TEXT NOT NULL,
    paquete_descripcion TEXT,
    paquete_fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
    paquete_destino TEXT NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (ruta_id) REFERENCES ruta(ruta_id) ON DELETE SET NULL,
    FOREIGN KEY (estado_id) REFERENCES estado_entrega(estado_id) ON DELETE SET NULL
);
