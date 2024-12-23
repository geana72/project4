// src/services/userService.js

import authService from './authService';

// Funcție pentru a obține detaliile utilizatorului autenticat
const getMe = authService.getMe;

// Funcție pentru înregistrare
const register = authService.register;

// Funcție pentru autentificare
const login = authService.login;

// Funcție pentru logout
const logout = authService.logout;

// Funcție pentru a verifica dacă utilizatorul este autentificat
const isAuthenticated = authService.isAuthenticated;

// Funcție pentru a urmări/unfollow un utilizator
const follow = authService.follow;

// Funcție pentru a căuta utilizatori
const searchUsers = authService.searchUsers;

// Funcție pentru a obține profilul unui utilizator specific
const getProfile = authService.getProfile;

// Creăm un obiect de servicii
const userService = {
  getMe,
  register,
  login,
  logout,
  isAuthenticated,
  follow,
  searchUsers,
  getProfile,
};

// Exportăm obiectul de servicii
export default userService;
