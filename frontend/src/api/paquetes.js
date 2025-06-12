import { fetchData } from './index.js';

export const paqueteList = (token) => fetchData('paquetes-admin/', 'GET', null, token);

export const generarRutaPaquete = (paqueteId, token) => fetchData(`generar_ruta/${paqueteId}/`, 'POST', null, token);
