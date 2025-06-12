import React, { useEffect, useState } from 'react';

import LoginForm from './LoginForm';
import { paqueteList, generarRutaPaquete } from './api/paquetes'; 
import RegisterDriver from './RegisterDriver';


export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [paquetes, setPaquetes] = useState([]);
    const [error, setError] = useState('');

    const [mostrarRegistroConductor, setMostrarRegistroConductor] = useState(false);

    const [mensajeRegistro, setMensajeRegistro] = useState('');

    // -> formateo de fecha
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-CL', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    // NOTE: SI HAY ALGUN ERROR DE LOGIN, EJECUTAR CON REMOVEITEM PARA RESETEAR TOKEN, FORZAR LOGIN Y LUEGO DEJARLO COMO ESTABA
    useEffect(() => {
        // localStorage.removeItem('token'); // -> descomentar para eliminar token de la sesión (para forzar login)
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
 
        <div>
        <button onClick={() => setMostrarRegistroConductor(!mostrarRegistroConductor)}>
        {mostrarRegistroConductor ? 'Ocultar Formulario' : 'Registrar Transportista'}
        </button>

        {mostrarRegistroConductor && (
            <RegisterDriver
            onRegisterSuccess={() => {
                setMostrarRegistroConductor(false);
                setMensajeRegistro('Conductor registrado exitosamente.');
            }}
            onCancel={() => setMostrarRegistroConductor(false)}
            />
        )}

        {mensajeRegistro && <p style={{ color: 'green' }}>{mensajeRegistro}</p>}

        </div>

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
                <p><strong>Nombre del cliente:</strong> {paquete.usuario_nombre} {paquete.usuario_apellido}</p>
                <p><strong>Correo electrónico:</strong> {paquete.usuario_correo}</p>
                <p><strong>Peso:</strong> {paquete.paquete_peso} kg</p>
                <p><strong>Dimensiones:</strong> {paquete.paquete_dimensiones}cm</p>
                <p><strong>Descripción:</strong> {paquete.paquete_descripcion}</p>
                <p><strong>Destino:</strong> {paquete.paquete_destino}</p>
                <p><strong>Estado:</strong> {paquete.estado_nombre|| paquete.estado}</p>
                <p><strong>Fecha de Envío:</strong> {formatDate(paquete.paquete_fecha_envio)}</p>
                
                {!paquete.ruta && (
                    <button
                    style={{ marginTop: '10px' }}
                    onClick={async () => {
                        const confirm = window.confirm("¿Generar ruta para este paquete?");
                        if (!confirm) return;

                        try {
                            const token = localStorage.getItem('token');
                            await generarRutaPaquete(paquete.paquete_id, token);

                            alert("Ruta generada correctamente");

                            // Actualizamos localmente para ocultar el botón sin recargar
                            setPaquetes((prev) =>
                                prev.map((p) =>
                                    p.paquete_id === paquete.paquete_id ? { ...p, ruta: true } : p
                                )
                            );

                        } catch (error) {
                            alert("Error de red: " + error.message);
                        }
                    }}
                    >
                    Generar Ruta
                    </button>
                )}

                {paquete.ruta && (
                    <p style={{ color: 'green' }}>Ruta generada correctamente.</p>
                )}

                </li>
            ))}
            </ul>
        )}
        </section>
        </div>

    );
}

