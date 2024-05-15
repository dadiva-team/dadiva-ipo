import React from 'react';
import { Box } from '@mui/material';
import { useLoggedIn } from '../../session/Session';
import { PreDadivaLoginCard } from './PreDadivaLoginCard';
import { PreDadivaInfoCard } from './PreDadivaInfoCard';

export default function Home() {
  const loggedIn = useLoggedIn();

  return (
    <div>
      <h1>DEMO</h1>
      <button
        type="button"
        value="Clear Session"
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
        style={{ display: 'block', marginBottom: '10px' }}
      >
        Clear Session
      </button>
      <button
        type="button"
        value="Clear Session"
        onClick={() => {
          window.location.href = '/backoffice';
        }}
        style={{ display: 'block', marginBottom: '10px' }}
      >
        BACK OFFICE
      </button>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          mt: 4,
          mb: 4,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {loggedIn ? <PreDadivaInfoCard /> : <PreDadivaLoginCard />}
      </Box>
    </div>
  );
}
