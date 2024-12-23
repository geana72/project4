// src/pages/Home.jsx

import React from 'react';
import { Container, Typography, Box } from '@mui/material';

function Home() {
  return (
    <Container maxWidth="md">
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Bine ai venit la PoliSocial!
        </Typography>
        <Typography variant="body1">
          Acesta este un site de socializare fictiv. Înregistrează-te sau loghează-te pentru a începe.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
