// src/pages/Register.jsx

import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const steps = ['Informații de bază', 'Informații suplimentare'];

function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState({
    username: '',
    email: '',
    telefon: '',
    password: '',
    password2: '',
    rol: '',
    localitate_curenta: '',
    serviciu_curent: '',
    localitate_dorita: '',
    serviciu_dorit: '',
    detalii: '',
  });
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(UserContext);
  const navigate = useNavigate();

  // Stări pentru a arăta/ascunde parola principală
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
  };

  const handleNext = () => {
    // Validare Etapa 1
    if (activeStep === 0) {
      const { username, email, telefon, password, password2 } = form;
      if (!username || !email || !telefon || !password || !password2) {
        setErrorMessage('Te rugăm să completezi toate câmpurile de bază.');
        return;
      }
      if (password !== password2) {
        setErrorMessage('Parolele nu se potrivesc.');
        return;
      }
      // Validări suplimentare
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Adresa de email este invalidă.');
        return;
      }
      const telefonRegex = /^(\+?\d{1,4}[\s-]?)?\d{10,15}$/; // Include prefixe internaționale
      if (!telefonRegex.test(telefon)) {
        setErrorMessage('Numărul de telefon este invalid.');
        return;
      }
    }

    // Validare Etapa 2
    if (activeStep === 1) {
      const { rol, localitate_curenta, serviciu_curent, localitate_dorita, serviciu_dorit, detalii } = form;
      if (!rol || !localitate_curenta || !serviciu_curent || !localitate_dorita || !serviciu_dorit) {
        setErrorMessage('Te rugăm să completezi toate câmpurile suplimentare.');
        return;
      }
      if (detalii.length > 110) {
        setErrorMessage('Detaliile suplimentare nu pot depăși 110 caractere.');
        return;
      }
    }

    setErrorMessage('');
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });
      await register(formData);
      setLoading(false);
      setSuccessMessage('Cont creat cu succes! Verifică emailul pentru activare.');
      // Redirecționează la login după 3 secunde
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        const errors = Object.values(err.response.data).flat();
        setErrorMessage(errors.join(' '));
      } else {
        setErrorMessage('Eroare la înregistrare. Încearcă din nou.');
      }
      console.error(err);
    }
  };

  // Funcție pentru a togglează vizibilitatea parolei principale
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2}>
        <Typography variant="h4" align="center" gutterBottom>
          Înregistrare
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box mt={3}>
          {activeStep === 0 && (
            <Box>
              <TextField
                label="Username"
                name="username"
                fullWidth
                value={form.username}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.username && !form.username}
                helperText={touched.username && !form.username ? 'Username este obligatoriu!' : ''}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={
                  (touched.email && !form.email) ||
                  (touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                }
                helperText={
                  touched.email && !form.email
                    ? 'Email este obligatoriu!'
                    : touched.email && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
                    ? 'Email invalid!'
                    : ''
                }
              />
              <TextField
                label="Telefon"
                name="telefon"
                fullWidth
                value={form.telefon}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={
                  touched.telefon &&
                  (!form.telefon || !/^(\+?\d{1,4}[\s-]?)?\d{10,15}$/.test(form.telefon))
                }
                helperText={
                  touched.telefon && !form.telefon
                    ? 'Telefonul este obligatoriu!'
                    : touched.telefon && form.telefon && !/^(\+?\d{1,4}[\s-]?)?\d{10,15}$/.test(form.telefon)
                    ? 'Număr de telefon invalid!'
                    : ''
                }
              />
              <TextField
                label="Parolă"
                name="password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.password && form.password.length < 6}
                helperText={
                  touched.password && form.password.length < 6
                    ? 'Parola trebuie să aibă minim 6 caractere!'
                    : ''
                }
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
              <TextField
                label="Confirmare Parolă"
                name="password2"
                type="password"
                fullWidth
                value={form.password2}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={
                  touched.password2 &&
                  (form.password2 !== form.password || form.password2.length < 6)
                }
                helperText={
                  touched.password2 && form.password2 !== form.password
                    ? 'Parolele nu se potrivesc!'
                    : touched.password2 && form.password2.length < 6
                    ? 'Parola trebuie să aibă minim 6 caractere!'
                    : ''
                }
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              <TextField
                select
                label="Rol"
                name="rol"
                fullWidth
                value={form.rol}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.rol && !form.rol}
                helperText={touched.rol && !form.rol ? 'Rolul este obligatoriu!' : ''}
              >
                <MenuItem value="">Selectează rolul</MenuItem>
                <MenuItem value="agent">Agent</MenuItem>
                <MenuItem value="ofiter">Ofițer</MenuItem>
              </TextField>
              <TextField
                label="Localitate Curentă"
                name="localitate_curenta"
                fullWidth
                value={form.localitate_curenta}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.localitate_curenta && !form.localitate_curenta}
                helperText={
                  touched.localitate_curenta && !form.localitate_curenta
                    ? 'Localitatea curentă este obligatorie!'
                    : ''
                }
              />
              <TextField
                label="Serviciu Curent"
                name="serviciu_curent"
                fullWidth
                value={form.serviciu_curent}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.serviciu_curent && !form.serviciu_curent}
                helperText={
                  touched.serviciu_curent && !form.serviciu_curent
                    ? 'Serviciul curent este obligatoriu!'
                    : ''
                }
              />
              <TextField
                label="Localitate Dorită"
                name="localitate_dorita"
                fullWidth
                value={form.localitate_dorita}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.localitate_dorita && !form.localitate_dorita}
                helperText={
                  touched.localitate_dorita && !form.localitate_dorita
                    ? 'Localitatea dorită este obligatorie!'
                    : ''
                }
              />
              <TextField
                label="Serviciu Dorit"
                name="serviciu_dorit"
                fullWidth
                value={form.serviciu_dorit}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                error={touched.serviciu_dorit && !form.serviciu_dorit}
                helperText={
                  touched.serviciu_dorit && !form.serviciu_dorit
                    ? 'Serviciul dorit este obligatoriu!'
                    : ''
                }
              />
              <TextField
                label="Detalii Suplimentare"
                name="detalii"
                fullWidth
                multiline
                rows={4}
                value={form.detalii}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                inputProps={{ maxLength: 110 }}
                helperText={`${form.detalii.length}/110`}
              />
            </Box>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 2 }}>
              {successMessage}
            </Alert>
          )}
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              variant="outlined"
            >
              Înapoi
            </Button>
            {activeStep < steps.length - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Următorul
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Înregistrează-te'}
              </Button>
            )}
          </Box>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Ai deja un cont? <Link to="/login">Login</Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
