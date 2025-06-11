import { fetchData } from './index.js';

// NOTE: Tengo que revisar el endpoint, ya que se supone que debe ser distinto al de la app móvil,
// este deberia ser algo como 'paquetes-admin/listar_paquetes/' (lo compruebo en urls.py)
export const paqueteList = (token) => fetchData('paquetes-admin/', 'GET', null, token);
