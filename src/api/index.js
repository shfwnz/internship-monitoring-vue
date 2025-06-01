import axios from 'axios';
import router from '../router';

const api = axios.create({
  baseURL: 'http://192.168.1.6:8000/api',
});

const LARAVEL_BASE_URL = 'http://192.168.1.6:8000';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      
      // Redirect to login
      if (router.currentRoute.value.name !== 'login') {
        router.push('/login');
      }
    }
    return Promise.reject(error);
  }
);

export { api, LARAVEL_BASE_URL, getToken };
