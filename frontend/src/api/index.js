import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token & automatically handle FormData Content-Type
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('internpath_token') || localStorage.getItem('internmatch_token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // CRITICAL: When sending FormData, delete Content-Type so the browser sets
  // multipart/form-data with the correct boundary parameter automatically!
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
}, (error) => Promise.reject(error));

export default API;
