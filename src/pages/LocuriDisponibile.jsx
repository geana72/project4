// src/pages/LocuriDisponibile.jsx

import React, { useEffect, useState } from 'react';
import transferService from '../services/transferService';
import { Container, Card, CardContent, Typography } from '@mui/material';

function LocuriDisponibile() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    transferService.getLocuriDisponibile().then(setUsers).catch(console.error);
  }, []);

  return (
    <Container maxWidth="sm" sx={{mt:2}}>
      <Typography variant="h5" mb={2}>Locuri Disponibile</Typography>
      {users.map(u => (
        <Card key={u.id} sx={{mb:2}}>
          <CardContent>
            <Typography variant="h6">{u.username}</Typography>
            <Typography>Rol: {u.rol}</Typography>
            <Typography>Localitate Curentă: {u.localitate_curenta}</Typography>
            <Typography>Serviciu Curent: {u.serviciu_curent}</Typography>
            <Typography>Contact: {u.email}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default LocuriDisponibile;
