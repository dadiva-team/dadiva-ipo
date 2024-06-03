import { Box, Button, Paper } from '@mui/material';
import React from 'react';
import { Submission } from '../../../domain/Submission';
import Typography from '@mui/material/Typography';

interface DoctorSearchResultProps {
  submission: Submission;
  onCheckSubmission: () => void;
}

export function DoctorSearchResult({ submission, onCheckSubmission }: DoctorSearchResultProps) {
  console.log(submission);
  return (
    <Paper elevation={2} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
      <Box sx={{ marginLeft: 2 }}>
        <Typography variant="h6" component="div">
          {'Mock Name'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          NIC: {submission.nic}
        </Typography>
        <Button onClick={() => onCheckSubmission()}> {'Ver formulario pendente'}</Button>
        <Button>{'Ver formularios antigos'}</Button>
      </Box>
    </Paper>
  );
}
