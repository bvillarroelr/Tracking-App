import { fetchData } from './index'

export const paqueteRegister = (datos, token) => fetchData('registrar_paquete/', 'POST', datos, token);
