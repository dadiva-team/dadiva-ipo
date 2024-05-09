import React from 'react';
import { Alert, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface ErrorAlertProps {
  error: string | null;
  clearError: () => void;
}

export function ErrorAlert({ error, clearError }: ErrorAlertProps) {
  return (
    <>
      {error && (
        <Alert
          action={
            <IconButton aria-label="close" color="inherit" size="small" onClick={clearError}>
              <Close fontSize="inherit" />
            </IconButton>
          }
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}
    </>
  );
}
