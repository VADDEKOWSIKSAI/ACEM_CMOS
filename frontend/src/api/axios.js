import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.group(`[AXIOS V2] ${config.method.toUpperCase()} ${config.url}`);
        console.log(`Token Found: ${!!token}`);
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log(`Auth Header: ${config.headers['Authorization'].substring(0, 15)}...`);
        }
        console.groupEnd();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
