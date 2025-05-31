import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.6:8000/api',
});

const LARAVEL_BASE_URL = 'http://192.168.1.6:8000';

const getToken = () => {
  return localStorage.getItem('token');
};

export { api, LARAVEL_BASE_URL, getToken };
