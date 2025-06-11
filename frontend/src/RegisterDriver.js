import React, { useState } from 'react';

import { conductorRegister } from './api/conductores';

export default function RegisterDriver({ onRegisterSuccess, onCancel }) {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');

    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token'); // -> se obtiene el token de la sesión

            const conductorData = {
                usuario_nombre: nombre,
                usuario_apellido: apellido,
                usuario_correo: correo,
                usuario_contrasena: contrasena,
            };

            await conductorRegister(conductorData, token);

            setMensaje('Conductor registrado exitosamente.');
            setError('');

            setNombre('');
            setApellido('');
            setCorreo('');
            setContrasena('');
        
            if (onRegisterSuccess) {
                onRegisterSuccess(); 
            }

        } catch (error) {
            setError('Error al registrar al conductor. Inténtalo de nuevo.');
        }
    };
    
    return (
        <form onSubmit={handleRegister}>
        <h2>Registrar Conductor</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

        <div>
        <label>Nombre:</label>
        <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        />
        </div>

        <div>
        <label>Apellido:</label>
        <input
        type="text"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        required
        />
        </div>

        <div>
        <label>Email:</label>
        <input
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        required
        />
        </div>

        <div>
        <label>Contraseña:</label>
        <input
        type="password"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
        />
        </div>

        <button type="submit">Registrar</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
        </form>

    );



}
