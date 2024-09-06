import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import LogoutIcon from '@mui/icons-material/Logout';
import { Role, useSessionManager } from '../../session/Session';
import { handleRequest } from '../../services/utils/fetch';
import { UserServices } from '../../services/users/UserServices';
import { useTranslation } from 'react-i18next';

type UserProps = {
  name: string;
  nic: string;
  roles: Role[];
};

const getPrefix = (roles: Role[]) => {
  if (roles.includes(Role.ADMIN)) {
    return 'Eng';
  }
  if (roles.includes(Role.DOCTOR)) {
    return 'Dr';
  }
  return '';
};

const MyIcon = () => <PersonIcon sx={{ fontSize: 50 }} />;

const DadorInfo = ({ name, nic, roles }: UserProps) => {
  const { t } = useTranslation();
  const sessionManager = useSessionManager();
  const prefix = getPrefix(roles);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickLogout = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleLogout = async () => {
    const [error, res] = await handleRequest(UserServices.logout());
    console.log('Logout:', res);
    if (error || !res) {
      sessionManager.clearSession();
    }

    setDialogOpen(false);
  };

  return (
    <>
      <Paper elevation={2} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
        <MyIcon />
        <Box sx={{ marginLeft: 2 }}>
          <Typography variant="h6" component="div">
            {prefix ? `${prefix} ${name}` : name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            NIC: {nic}
          </Typography>
        </Box>
        <IconButton sx={{ ml: 1 }} aria-label="logout" size="small" onClick={handleClickLogout}>
          <LogoutIcon fontSize="inherit" />
        </IconButton>
      </Paper>
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>{t('Logout Title Message')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('Logout Message')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {t('Cancel')}
          </Button>
          <Button onClick={handleLogout} color="secondary" autoFocus>
            {t('Logout')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export function UserInfo({ name, nic, roles }: UserProps) {
  return (
    <Box
      sx={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: '20px',
      }}
    >
      <DadorInfo name={name} nic={nic} roles={roles} />
    </Box>
  );
}
