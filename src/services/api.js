// src/services/api.js

import axios from 'axios';

// Definirea bazei URL pentru API
const API_BASE_URL = 'http://localhost:8000/'; // Înlocuiește cu URL-ul tău real

// Crearea unei instanțe Axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Lista endpoint-urilor excluse din gestionarea erorilor 401
const excludedEndpoints = [
  '/auth/jwt/create/',                   // Endpoint-ul de login
  '/auth/jwt/refresh/',                 // Endpoint-ul de refresh token
  '/auth/users/',                        // Endpoint-ul de înregistrare
  '/auth/users/resend_activation/',      // Endpoint-ul de resend activation email
  // Adaugă alte endpoint-uri publice dacă este necesar
];

// Interceptor pentru a adăuga Authorization header la fiecare cerere
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor pentru a gestiona erorile 401 și reîmprospătarea automată a token-ului
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Verifică dacă originalRequest și originalRequest.url sunt definite
    if (!originalRequest || !originalRequest.url) {
      console.warn('Original request sau URL-ul cererii este undefined:', originalRequest);
      return Promise.reject(error);
    }

    console.log('Interceptor error for URL:', originalRequest.url);

    // Verifică dacă URL-ul cererii este în lista de endpoint-uri excluse
    const isExcluded = excludedEndpoints.some((url) => originalRequest.url.endsWith(url));

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isExcluded
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh');

      if (refreshToken) {
        try {
          // Cerere pentru reîmprospătarea token-ului
          const { data } = await api.post('auth/jwt/refresh/', { refresh: refreshToken });
          localStorage.setItem('access', data.access);
          api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Dacă reîmprospătarea token-ului eșuează, declanșează logout-ul
          window.dispatchEvent(new Event('logout'));
          return Promise.reject(refreshError);
        }
      } else {
        // Dacă nu există un refresh token, declanșează logout-ul
        window.dispatchEvent(new Event('logout'));
      }
    }

    return Promise.reject(error);
  }
);

export default api;
