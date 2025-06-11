import { fetchData } from './index';

export const conductorRegister = async (conductorData, token) => fetchData('conductores-admin/', 'POST', conductorData, token);






