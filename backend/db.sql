-- Habilitar claves foráneas en SQLite

PRAGMA foreign_keys = ON;

-- Tabla de Usuarios

CREATE TABLE usuario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT UNIQUE NOT NULL,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'conductor', 'admin')),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Estados de Entrega

CREATE TABLE estado_entrega (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    estado TEXT UNIQUE NOT NULL
);

-- Tabla de Rutas

CREATE TABLE ruta (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    distancia_km REAL NOT NULL,
    duracion_estimada_min INTEGER NOT NULL
);

-- Tabla de Paquetes

CREATE TABLE paquete (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    ruta_id INTEGER,
    estado_id INTEGER,
    peso REAL NOT NULL,
    dimensiones TEXT,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (ruta_id) REFERENCES ruta(id) ON DELETE SET NULL,
    FOREIGN KEY (estado_id) REFERENCES estado_entrega(id) ON DELETE SET NULL
);
