import { useNavigate } from 'react-router-dom';
import { Button, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Info } from '@mui/icons-material';
import React from 'react';
import { useTranslation } from 'react-i18next';

export function PreDadivaInfoCard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '40%',
        elevation: 16,
        justifyContent: 'space-between',
      }}
    >
      <Typography component="h1" variant="h5">
        <strong> {t('Pre Donation Card Title')} </strong>
      </Typography>
      <Typography component="h1" variant="body1">
        {t('Pre Donation Card Text')}
      </Typography>
      <Button
        variant="contained"
        startIcon={<Info />}
        onClick={() => navigate('form-info')}
        sx={{ mt: 4, width: '25%' }}
      >
        {t('Pre Donation Card Button')}
      </Button>
    </Paper>
  );
}
