import { fetchData } from './index';

export const loginAdmin = (credentials) => fetchData('api-token-auth/', 'POST', credentials);
