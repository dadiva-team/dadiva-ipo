import { useNavigate } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Info } from '@mui/icons-material';
import React from 'react';

export function PreDadivaInfoCard() {
  const navigate = useNavigate();
  return (
    <Paper
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '40%',
        justifyContent: 'space-between',
      }}
    >
      <Typography component="h1" variant="h5">
        <strong> Ler e aceitar os termos pre-dadiva</strong>
      </Typography>
      <Typography component="h1" variant="body1">
        Antes de preencher o questionário é necessario ler e aceitar os termos da dadiva.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Info />}
        onClick={() => navigate('form-info')}
        sx={{ mt: 4, width: '25%' }}
      >
        Começar
      </Button>
    </Paper>
  );
}
