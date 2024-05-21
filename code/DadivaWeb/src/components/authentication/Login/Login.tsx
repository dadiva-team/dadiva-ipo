import * as React from 'react';
import './Login.css';
import { PasswordField } from './PasswordField';
import { useLogin } from './useLogin';
import { Box, Button, CircularProgress, Divider, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ErrorAlert } from '../../shared/ErrorAlert';
import { NicField } from './NicField';

export default function Login() {
  const { error, setError, nic, password, showPassword, handleChange, handleSubmit, setShowPassword, loading } =
    useLogin();

  return (
    <Box display="flex" justifyContent="center">
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '30%',
          border: 1,
          borderColor: 'black',
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" component="h1" className="welcome">
            Bem-Vindo
          </Typography>
          <Typography variant="subtitle1" align="center">
            Entre na sua conta
          </Typography>

          <Box sx={{ flexDirection: 'row', justifyContent: 'space-around', mt: 2 }}>
            <NicField value={nic} onChange={handleChange} />
            <PasswordField
              value={password}
              showPassword={showPassword}
              handleChangePassword={handleChange}
              handleClickShowPassword={() => setShowPassword(!showPassword)}
            />
          </Box>
          <ErrorAlert error={error} clearError={() => setError(null)} />
          <Button type="submit" variant="contained" className="login-button" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Entrar'}
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
            <Divider sx={{ flex: 1, borderBottomWidth: '1,5px', borderColor: 'primary' }} />
            <Typography sx={{ margin: '0 8px' }}>Alternativamente</Typography>
            <Divider sx={{ flex: 1, borderBottomWidth: '1,5px', borderColor: 'primary' }} />
          </Box>
          <Button type="button" variant="outlined" className="auth-button">
            AUTENTICAÇÃO.GOV
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
