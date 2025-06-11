import { fetchData, fetchDataProject } from './index';

export const loginAdmin = (credentials) => fetchDataProject('api-token-auth/', 'POST', credentials);
