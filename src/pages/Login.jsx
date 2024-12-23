// src/pages/Login.jsx

import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import authService from '../services/authService';
import { toast } from 'react-toastify'; // Importă funcția toast

function Login() {
  // Stările pentru input-uri și controlul vizibilității parolei
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { login } = useContext(UserContext);

  // Handler pentru schimbarea username-ului
  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
    // Nu resetați mesajele de eroare automat
  };

  // Handler pentru schimbarea parolei
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    // Nu resetați mesajele de eroare automat
  };

  // Handler pentru afișarea/parcurgerea parolei
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Handler pentru login
  const handleLogin = async (e) => {
    e.preventDefault(); // Previne reîncărcarea paginii
    setLoading(true);
    try {
      await login(username, password);
      setLoading(false);
      // Navigarea este gestionată de UserProvider prin setarea user
    } catch (err) {
      setLoading(false);
      console.log('Error Response:', err.response); // Log pentru debugging
      // Toast-ul este gestionat în UserContext.js, nu trebuie să facem nimic aici
      // Pentru a nu reîncărca pagina, ne asigurăm că nu navigăm sau reîmprospătăm
    }
  };

  // Handler pentru resend activation email
  const handleResendActivationEmail = async () => {
    setResendLoading(true);
    try {
      await authService.resendActivationEmail(username);
      toast.success('Emailul de activare a fost trimis din nou. Verifică-ți inbox-ul.', { 
        position: "top-right",
        autoClose: 5000, 
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setResendLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        toast.error(
          error.response.data.detail ||
            'Ai atins limita de 3 trimitere a emailului de activare pe zi.',
          { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      } else {
        toast.error(
          error.response?.data?.detail ||
            'Eroare la trimiterea emailului de activare. Încearcă din nou mai târziu.',
          { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          }
        );
      }
      setResendLoading(false);
      console.error(error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        {/* Form pentru login */}
        <form onSubmit={handleLogin} noValidate>
          <TextField
            label="Username sau Email"
            fullWidth
            value={username}
            onChange={handleChangeUsername}
            margin="normal"
            required
          />
          <TextField
            label="Parola"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={password}
            onChange={handleChangePassword}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Butonul de login */}
          <Box sx={{ mt: 2, position: 'relative' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit" // Type submit pentru a utiliza onSubmit al formularului
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </Box>
        </form>
        {/* Butonul de resend activation email */}
        {username && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleResendActivationEmail}
              disabled={resendLoading}
              fullWidth
            >
              {resendLoading ? <CircularProgress size={24} color="inherit" /> : 'Reține Emailul de Activare'}
            </Button>
          </Box>
        )}
        {/* Link către pagina de înregistrare */}
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Nu ai un cont? <Link to="/register">Înregistrează-te</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
