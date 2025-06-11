import React, { useEffect, useState } from 'react';
import LoginForm from './LoginForm';
import { paqueteList, obtenerRutaPaquetes } from './paquetes';
import RouteMap from './RouteMap';
import polyline from '@mapbox/polyline';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [paquetes, setPaquetes] = useState([]);
  const [error, setError] = useState('');
  const [ruta, setRuta] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);

  useEffect(() => {
      const token = localStorage.getItem('token');
      if (token) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
      const cargarPaquetes = async () => {
          try {
              const token = localStorage.getItem('token');
              const data = await paqueteList(token);
              setPaquetes(data);
          } catch (error) {
              setError("Error al cargar los paquetes");
          }
      };
      if (isAuthenticated) cargarPaquetes();
  }, [isAuthenticated]);

  const handleSeleccion = (paquete_id) => {
      setSeleccionados((prev) =>
          prev.includes(paquete_id)
              ? prev.filter((id) => id !== paquete_id)
              : [...prev, paquete_id]
      );
  };

  const handleVerRuta = async () => {
      if (seleccionados.length === 0) {
          setError("Selecciona al menos un paquete");
          return;
      }
      setError('');
      try {
          const token = localStorage.getItem('token');
          const data = await obtenerRutaPaquetes(seleccionados, token);
          if (data.routes && data.routes[0]) {
              const decoded = polyline.decode(data.routes[0].polyline.encodedPolyline)
                  .map(([lat, lng]) => ({ lat, lng }));
              setRuta(decoded);
          } else {
              setRuta(null);
              setError("No se pudo obtener la ruta");
          }
      } catch (e) {
          setRuta(null);
          setError("Error al obtener la ruta");
      }
  };

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
                  <form>
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
                                  <input
                                      type="checkbox"
                                      checked={seleccionados.includes(paquete.paquete_id)}
                                      onChange={() => handleSeleccion(paquete.paquete_id)}
                                  />{' '}
                                  <strong>ID:</strong> {paquete.paquete_id} <br />
                                  <strong>Nombre del cliente:</strong> {paquete.usuario_nombre} <br />
                                  <strong>Peso:</strong> {paquete.paquete_peso} kg <br />
                                  <strong>Estado:</strong> {paquete.estado_nombre || paquete.estado} <br />
                                  <strong>Fecha de Envío:</strong> {paquete.paquete_fecha_envio}
                              </li>
                          ))}
                      </ul>
                      <button type="button" onClick={handleVerRuta}>
                          Ver Ruta
                      </button>
                  </form>
              )}
          </section>
          {ruta && (
              <section>
                  <h2>Ruta en el Mapa</h2>
                  <RouteMap path={ruta} />
              </section>
          )}
      </div>
  );
}

export default App;