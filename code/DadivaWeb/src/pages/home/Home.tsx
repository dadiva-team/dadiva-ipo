import React from 'react';
import { Box } from '@mui/material';
import { useLoggedIn } from '../../session/Session';
import { PreDadivaLoginCard } from '../../components/home/PreDadivaLoginCard';
import { PreDadivaInfoCard } from '../../components/home/PreDadivaInfoCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const loggedIn = useLoggedIn();
  const nav = useNavigate();

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
          nav('/backoffice');
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
