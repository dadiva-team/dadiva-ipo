import * as React from 'react';
import { Button } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNavigate } from 'react-router-dom';

export function FormInfo() {
  const navigate = useNavigate();
  return (
    <>
      <h1>Not yet implemented</h1>
      <h1>...</h1>
      <h1>...</h1>
      <Button
        variant="contained"
        onClick={() => {
          navigate('/form');
        }}
        startIcon={<NavigateNextIcon />}
        sx={{ borderRadius: 50 }}
      >
        Aceito os termos e condições
      </Button>
    </>
  );
}
