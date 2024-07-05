import { Box, Button } from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import HistoryIcon from '@mui/icons-material/History';
import {User} from "../../../domain/User/User";

interface DoctorSearchResultProps {
  user: User;
  onCheckPendingSubmission: () => void;
  onCheckOldSubmissions: () => void;
}

export function DoctorSearchResult({ user, onCheckPendingSubmission }: DoctorSearchResultProps) {
  return (
    <Box sx={{ marginLeft: 1, width: '20%', justifyContent: 'flex-start' }}>
      <Typography variant="h6" component="div">
        {user.name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        NIC: {user.nic}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button onClick={() => onCheckPendingSubmission()}> {'Form. pendente'}</Button>
        <Button endIcon={<HistoryIcon />}>{'Form. antigos'}</Button>
      </Box>
    </Box>
  );
}
