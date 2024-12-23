// src/pages/SearchResults.jsx

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { Container, Card, CardContent, Typography } from '@mui/material';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults() {
  const query = useQuery().get('q');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      userService.searchUsers(query).then(setResults).catch(console.error);
    }
  }, [query]);

  return (
    <Container maxWidth="sm" sx={{mt:2}}>
      <Typography variant="h5">Rezultate căutare pentru "{query}"</Typography>
      {results.map(r => (
        <Card key={r.id} sx={{mb:2}} onClick={()=>navigate('/profile/'+r.username)} style={{cursor:'pointer'}}>
          <CardContent>
            <Typography variant="h6">{r.username}</Typography>
            <Typography>{r.email}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default SearchResults;
