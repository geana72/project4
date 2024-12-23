// src/services/authService.js

import api from './api';

// Funcție pentru logout
const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

// Exportăm funcția de logout separat pentru a putea fi utilizată în alte fișiere
export const logoutUser = () => {
  logout();
};

// Funcție pentru înregistrare
const register = async (formData) => {
  try {
    // Djoser: POST /auth/users/
    const response = await api.post('auth/users/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Eroare la înregistrare:", error.response?.data || error.message);
    throw error;
  }
};

// Funcție pentru autentificare
const login = async (username, password) => {
  try {
    // Custom TokenObtainPairView: POST /auth/jwt/create/
    const response = await api.post('auth/jwt/create/', { username, password });
    // Setează tokenurile în localStorage
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    return response.data;
  } catch (error) {
    console.error("Eroare la autentificare:", error.response?.data || error.message);
    throw error;
  }
};

// Funcție pentru a verifica dacă utilizatorul este autentificat
const isAuthenticated = () => !!localStorage.getItem('access');

// Funcție pentru a obține detaliile utilizatorului autenticat
const getMe = async () => {
  try {
    const response = await api.get('auth/users/me/');
    return response.data;
  } catch (error) {
    console.error("Eroare la obținerea datelor utilizatorului:", error.response?.data || error.message);
    throw error;
  }
};

// Funcție pentru a obține profilul unui utilizator specific
const getProfile = async (username) => {
  try {
    const response = await api.get(`auth/users/profile/${username}/`);
    return response.data;
  } catch (error) {
    console.error(`Eroare la obținerea profilului pentru ${username}:`, error.response?.data || error.message);
    throw error;
  }
};

// Funcție pentru a urmări/unfollow un utilizator
const follow = async (username) => {
  try {
    const response = await api.post(`auth/users/profile/${username}/follow/`);
    return response.data;
  } catch (error) {
    console.error(`Eroare la follow/unfollow ${username}:`, error.response?.data || error.message);
    throw error;
  }
};

// Funcție pentru a căuta utilizatori
const searchUsers = async (query) => {
  try {
    const response = await api.get(`auth/users/search/?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Eroare la căutarea utilizatorilor pentru "${query}":`, error.response?.data || error.message);
    throw error;
  }
};

// Funcție pentru a trimite din nou emailul de activare
const resendActivationEmail = async (username) => {
  try {
    const response = await api.post('auth/users/resend_activation/', { username });
    return response.data;
  } catch (error) {
    console.error("Eroare la trimiterea din nou a emailului de activare:", error.response?.data || error.message);
    throw error;
  }
};

// Creăm un obiect de servicii
const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getMe,
  getProfile,
  follow,
  searchUsers,
  resendActivationEmail, // Adăugăm funcția nouă
};

// Exportăm obiectul de servicii
export default authService;
