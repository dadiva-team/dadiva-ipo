import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';

interface PasswordFieldProps {
  value: string;
  handleChangePassword: (ev: React.FormEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  handleClickShowPassword: () => void;
}

export function PasswordField({
  value,
  showPassword,
  handleChangePassword,
  handleClickShowPassword,
}: PasswordFieldProps) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LockIcon sx={{ pr: 1 }} />
      <TextField
        id="password"
        type={showPassword ? 'text' : 'password'}
        name="password"
        label={t('Password')}
        required
        fullWidth
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChangePassword(event)}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      {value && value.length > 0 ? (
        <CheckCircleIcon sx={{ fontSize: 20, ml: 1 }} />
      ) : (
        <CancelIcon sx={{ fontSize: 20, ml: 1 }} />
      )}
    </Box>
  );
}
