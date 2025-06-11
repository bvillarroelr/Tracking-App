import { fetchData } from './index.js';

export const paqueteList = (token) => fetchData('paquetes-admin/', 'GET', null, token);
