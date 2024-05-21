import React from 'react';
import { Box, TextField } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

interface NicFieldProps {
  value: string;
  onChange: (ev: React.FormEvent<HTMLInputElement>) => void;
}

export function NicField({ value, onChange }: NicFieldProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <AccountCircle sx={{ color: 'action.active', pr: 1 }} />
      <TextField
        id="nic"
        label="NIC"
        variant="outlined"
        required
        value={value}
        fullWidth
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange(event)}
        name="nic"
        sx={{ mb: 2 }}
      />
      {value && value.length == 9 ? (
        <CheckCircleIcon sx={{ fontSize: 20, ml: 1 }} />
      ) : (
        <CancelIcon sx={{ fontSize: 20, ml: 1 }} />
      )}
    </Box>
  );
}
