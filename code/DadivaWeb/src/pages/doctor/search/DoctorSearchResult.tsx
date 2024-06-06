import { Box, Button } from '@mui/material';
import React from 'react';
import { Submission } from '../../../domain/Submission';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';

interface DoctorSearchResultProps {
  submission: Submission;
  onCheckSubmission: () => void;
}

export function DoctorSearchResult({ submission, onCheckSubmission }: DoctorSearchResultProps) {
  console.log(submission);
  return (
    <Box sx={{ marginLeft: 1, width: '20%', justifyContent: 'flex-start' }}>
      <Typography variant="h6" component="div">
        {'Mock Name'}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        NIC: {submission.nic}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button onClick={() => onCheckSubmission()}> {'Form. pendente'}</Button>
        <Button endIcon={<HistoryIcon />}>{'Form. antigos'}</Button>
      </Box>
    </Box>
  );
}
