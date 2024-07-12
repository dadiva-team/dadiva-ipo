import { useNavigate } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Login } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function PreDadivaLoginCard() {
  const { t } = useTranslation();
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
        <strong> {t('Start Session')} </strong>
      </Typography>
      <Typography component="h1" variant="body1">
        {t('Login Card Text')}
      </Typography>
      <Button variant="contained" startIcon={<Login />} onClick={() => navigate('login')} sx={{ mt: 4, width: '50%' }}>
        {t('Start Session')}
      </Button>
    </Paper>
  );
}
