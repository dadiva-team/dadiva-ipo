import { useNavigate } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Login } from '@mui/icons-material';
import React from 'react';

export function PreDadivaLoginCard() {
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '40%',
        justifyContent: 'space-between',
      }}
    >
      <Typography component="h1" variant="h5">
        <strong> Iniciar sessão </strong>
      </Typography>
      <Typography component="h1" variant="body1">
        Inicie sessão com o seu NIC e password para poder preencher o questionario pre-dádiva.
      </Typography>
      <Button variant="contained" startIcon={<Login />} onClick={() => navigate('login')} sx={{ mt: 4, width: '50%' }}>
        Iniciar sessão
      </Button>
    </Paper>
  );
}
