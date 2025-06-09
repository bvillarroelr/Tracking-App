import React, { useState } from 'react';
import { loginAdmin } from './api/auth';

export default function LoginForm({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const data = await loginAdmin({ username, password });
            localStorage.setItem('token', data.token); // -> se guarda el token en el localStorage
            setError('');
            onLoginSuccess();
        } catch (error) {
            setError('Credenciales inválidas o error en la conexión');
        }

    };

    return (
        <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: '0 auto' }}>
        <h2>Iniciar Sesión (Admin)</h2>
        <div>
        <label>Usuario:</label>
        <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        </div>
        <div>
        <label>Contraseña:</label>
        <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        </div>
        <button type="submit" style={{ padding: '10px 20px' }}>Ingresar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );



}
