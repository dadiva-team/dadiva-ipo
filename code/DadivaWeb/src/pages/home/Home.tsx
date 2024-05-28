import React from 'react';
import { Box } from '@mui/material';
import { PreDadivaInfoCard } from '../../components/home/PreDadivaInfoCard';
import { useNavigate } from 'react-router-dom';
import { Uris } from '../../utils/navigation/Uris';
import BACKOFFICE = Uris.BACKOFFICE;

export default function Home() {
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
        value="Go to Backoffice"
        onClick={() => {
          nav(BACKOFFICE);
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
        <PreDadivaInfoCard />
      </Box>
    </div>
  );
}
