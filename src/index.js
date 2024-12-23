// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // Import corect pentru React 18
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // Creează root folosind noul API

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <App />
        <ToastContainer
          position="top-right"
          autoClose={5000} // 5000ms = 5 secunde, poți ajusta după preferință
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored" // Poți schimba tema după preferință
        />
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
