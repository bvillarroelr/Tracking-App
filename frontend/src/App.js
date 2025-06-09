import React, { useEffect, useState } from 'react';

import LoginForm from './LoginForm';
import { paqueteList } from './api/paquetes'; 

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [paquetes, setPaquetes] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token'); // -> se obtiene el token de la sesión
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        const cargarPaquetes = async () => {
            try {
                const token = localStorage.getItem('token'); // -> se obtiene el token de la sesión
                const data = await paqueteList(token); // -> se llama a la función para listar paquetes
                setPaquetes(data);
            } catch (error) {
                console.error("Error al cargar los paquetes:", error.message);
            }

        };

        if (isAuthenticated) {
            cargarPaquetes();
        }
        
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
        <h1>📦 Panel de Administración</h1>
        <p>Bienvenido al sistema de seguimiento de pedidos.</p>

        <hr style={{ margin: '2rem 0' }} />

        <section>
        <h2>📦 Lista de Paquetes</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {paquetes.length === 0 ? (
            <p>No hay paquetes cargados.</p>
        ) : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
            {paquetes.map((paquete) => (
                <li
                key={paquete.paquete_id}
                style={{
                    border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        marginBottom: '1rem',
                        backgroundColor: '#f9f9f9',
                }}
                >
                <p><strong>ID:</strong> {paquete.paquete_id}</p>
                <p><strong>Nombre del cliente:</strong> {paquete.usuario_nombre}</p>
                <p><strong>Peso:</strong> {paquete.paquete_peso} kg</p>
                <p><strong>Estado:</strong> {paquete.estado_nombre|| paquete.estado}</p>
                <p><strong>Fecha de Envío:</strong> {paquete.paquete_fecha_envio}</p>
                </li>
            ))}
            </ul>
        )}
        </section>
        </div>

    );
}

export default App;
