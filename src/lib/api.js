import axios from 'axios';
import { getToken, clearSession } from './auth';

const configured = import.meta.env.VITE_API_URL;

// A production build must never point at localhost by accident.
if (!configured && !import.meta.env.DEV) {
    throw new Error('VITE_API_URL is not set. Configure it before building for production.');
}

export const api = axios.create({
    baseURL: configured || 'http://localhost:5000',
    timeout: 60000
});

// Every request carries the JWT if the user is logged in.
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// A 401 means the token is missing/expired: clear it and send the user to login.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearSession();
            const { pathname, search } = window.location;
            if (pathname !== '/login' && pathname !== '/register') {
                const next = encodeURIComponent(pathname + search);
                window.location.href = `/login?next=${next}`;
            }
        }
        return Promise.reject(error);
    }
);

export function getErrorMessage(error, fallback = 'Something went wrong') {
    if (error?.code === 'ECONNABORTED') {
        return 'The request timed out. Please try again.';
    }
    if (error?.message === 'Network Error') {
        return 'Could not reach the server. Check your connection and try again.';
    }
    return error?.response?.data?.error || error?.message || fallback;
}
