import axios from 'axios';
import { getToken } from './auth';

const baseAPI = (baseURL) => {
    const api = axios.create(
        { baseURL: baseURL });
    /* Pega o token e coloca na no header x-access-token, recebido após autenticar */
    api.interceptors.request.use(async (config) => {
        const token = getToken();
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    });
    return api;
    
}

export default baseAPI;
