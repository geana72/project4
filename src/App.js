// src/App.js

import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import LocuriDisponibile from './pages/LocuriDisponibile';
import SearchResults from './pages/SearchResults';
import PublicRoute from './components/PublicRoute';
import { UserContext } from './contexts/UserContext';

function App() {
  const { user } = useContext(UserContext);

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Protejează rutele publice */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        {/* Rutele private */}
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/locuri-disponibile" element={<LocuriDisponibile />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
    </>
  );
}

export default App;
