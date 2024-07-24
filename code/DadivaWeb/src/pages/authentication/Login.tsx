import * as React from 'react';
import '../../components/authentication/Login/Login.css';
import { PasswordField } from '../../components/authentication/Login/PasswordField';
import { useLogin } from '../../components/authentication/Login/useLogin';
import { Box, Button, CircularProgress, Divider, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { NicField } from '../../components/authentication/Login/NicField';
import { useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const returnTo = searchParams.get('returnUrl') || '/';

  const { error, setError, nic, password, showPassword, handleChange, handleSubmit, setShowPassword, loading } =
    useLogin(returnTo);

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
