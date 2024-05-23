import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { BackofficeNavBar } from '../../components/backoffice/BackofficeNavBar';

export function Backoffice() {
  return (
    <Box display="flex">
      <BackofficeNavBar />
      <Box component="main" sx={{ width: '100%' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
