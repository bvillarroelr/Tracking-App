import { fetchData } from './index'

export const paqueteRegister = (data, token) => fetchData('paquetes/registrar_paquete/', 'POST', data, token);

export const paqueteList = (token) => fetchData('paquetes/listar_paquetes/', 'GET', null, token);

export const paqueteDetail = (id, token) => fetchData(`paquetes/${id}/`, 'GET', null, token);
