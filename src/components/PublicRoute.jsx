// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

const PublicRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  // Dacă utilizatorul este autentificat, redirecționează către pagina principală
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Dacă utilizatorul nu este autentificat, permite accesul
  return children;
};

export default PublicRoute;
