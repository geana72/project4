// src/contexts/UserContext.js

import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService, { logoutUser } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Funcție pentru a obține datele utilizatorului
  const fetchUser = useCallback(async () => {
    console.log('Fetching user data...');
    if (authService.isAuthenticated()) {
      try {
        const userData = await authService.getMe();
        console.log('User data fetched:', userData);
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);

        // Verifică dacă eroarea este din cauza contului neactivat
        if (error.response) {
          const data = error.response.data;
          if (data.detail && (data.detail.toLowerCase().includes('active') || data.detail.toLowerCase().includes('activate'))) {
            toast.error('Contul tău nu este activat. Te rugăm să verifici emailul pentru link-ul de activare.', { 
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          } else {
            toast.error('Nu s-a putut obține datele utilizatorului. Încearcă din nou.', { 
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          }
        } else {
          toast.error('Eroare de rețea. Încearcă din nou.', { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }

        // Dezactivează token-urile
        logoutUser();

        // Condiționează navigarea la /login doar dacă nu ești deja pe login
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    } else {
      console.log('User is not authenticated.');
      setUser(null);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    console.log('UserProvider mounted');
    fetchUser();

    // Funcție pentru a gestiona evenimentul de logout
    const handleLogout = () => {
      console.log('Handling logout');
      logoutUser();
      setUser(null);
      navigate('/login', { replace: true });
    };

    // Adaugă un ascultător pentru evenimentul global 'logout'
    window.addEventListener('logout', handleLogout);

    // Curăță ascultătorul când componenta este demontată
    return () => {
      console.log('UserProvider unmounted');
      window.removeEventListener('logout', handleLogout);
    };
  }, [fetchUser, navigate]);

  // Funcție pentru login
  const loginUser = async (username, password) => {
    console.log('Logging in user:', username);
    try {
      await authService.login(username, password);
      await fetchUser();
    } catch (error) {
      console.error('Login failed:', error);
      // Gestionarea erorilor de login (ex: credentiale invalide sau cont neactivat)
      if (error.response && error.response.data) {
        const backendErrors = error.response.data;
        let formattedError = '';

        // Verifică dacă mesajul de eroare indică că contul nu este activat
        if (backendErrors.detail && (backendErrors.detail.toLowerCase().includes('active') || backendErrors.detail.toLowerCase().includes('activate'))) {
          formattedError = 'Contul tău nu este activat. Te rugăm să verifici emailul pentru link-ul de activare.';
        }
        // Verifică dacă mesajul de eroare este pentru credentiale invalide
        else if (backendErrors.non_field_errors && backendErrors.non_field_errors.length > 0) {
          formattedError = 'Credentiale invalide. Verifică username și parola.';
        }
        // Mesaj generic pentru alte erori
        else {
          formattedError = 'Eroare la autentificare. Verifică username și parola.';
        }

        console.log('Showing toast error:', formattedError);
        toast.error(formattedError, { 
          position: "top-right",
          autoClose: 5000, // 5 secunde
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        // Mesaj generic dacă backend-ul nu returnează detalii
        toast.error('Eroare la autentificare. Verifică username și parola.', { 
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }

      throw error; // Re-throw pentru a fi capturat în Login.jsx
    }
  };

  // Funcție pentru logout manual
  const logoutUserContext = () => {
    console.log('Logging out user');
    authService.logout();
    setUser(null);
    navigate('/login', { replace: true });
  };

  // Funcție pentru înregistrare
  const registerUser = async (formData) => {
    console.log('Registering user');
    await authService.register(formData);
    // Nu auto-login după înregistrare
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login: loginUser,
        logout: logoutUserContext,
        register: registerUser,
        fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
