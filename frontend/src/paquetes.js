import { fetchData } from './index.js';

export const paqueteList = (token) => fetchData('paquetes-admin/', 'GET', null, token);

export const obtenerRutaPaquetes = (paquete_ids, token) =>
  fetchData('generar_ruta/', 'POST', { paquete_ids }, token);