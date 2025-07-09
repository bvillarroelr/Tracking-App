import { fetchData } from './index'

export const paqueteRegister = (data, token) => fetchData('paquetes/registrar_paquete/', 'POST', data, token);

export const paqueteList = (token) => fetchData('paquetes/listar_paquetes/', 'GET', null, token);

export const listaPaquetesConRuta = (token) => fetchData('paquetes/listar_paquetes_con_ruta/', 'GET', null, token);

export const paqueteDetail = (id, token) => fetchData(`paquetes/${id}/`, 'GET', null, token);

export const marcarComoEntregado = (paqueteId, token) => fetchData(`paquetes/${paqueteId}/marcar_entregado/`, 'POST', null, token);