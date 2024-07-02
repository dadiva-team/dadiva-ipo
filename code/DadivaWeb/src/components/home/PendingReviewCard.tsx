import { Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import React from 'react';

interface PendingReviewCardProps {
  submissionDate?: string;
}

export function PendingReviewCard({ submissionDate }: PendingReviewCardProps) {
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
      <Typography variant="h6">Tem uma submissão pendente de revisão</Typography>
      {submissionDate && <Typography variant="subtitle1">Data de submissão: {submissionDate}</Typography>}
      <Typography component="h1" variant="body1" sx={{ pt: 1 }}>
        Por favor aguarde a revisão do seu formulário.
      </Typography>
    </Paper>
  );
}
