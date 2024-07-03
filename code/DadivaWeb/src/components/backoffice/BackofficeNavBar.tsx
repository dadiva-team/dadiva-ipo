import React from 'react';
import { List, Divider, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GavelIcon from '@mui/icons-material/Gavel';
import FormIcon from '@mui/icons-material/Description';
import MedicationIcon from '@mui/icons-material/LocalPharmacy';
import StatsIcon from '@mui/icons-material/BarChart';
import DonorsIcon from '@mui/icons-material/People';
import DoctorsIcon from '@mui/icons-material/MedicalServices';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { Uris } from '../../utils/navigation/Uris';
import BACKOFFICE = Uris.BACKOFFICE;
import EDIT_FORM = Uris.EDIT_FORM;
import MANAGE_USERS = Uris.MANAGE_USERS;
import EDIT_INCONSISTENCIES = Uris.EDIT_INCONSISTENCIES;
import TERMS_CONDITIONS = Uris.TERMS_CONDITIONS;
import { navBuilder, NavItem } from '../shared/NavBuilder';

export function BackofficeNavBar() {
  const location = useLocation();
  const nav = useNavigate();

  const navItems: NavItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: BACKOFFICE, disabled: false },
    { text: 'Editar Formulário', icon: <FormIcon />, path: EDIT_FORM, disabled: false },
    { text: 'Editar Termos e Condições', icon: <GavelIcon />, path: TERMS_CONDITIONS, disabled: false },
    { text: 'Editar Incoerências', icon: <MedicationIcon />, path: EDIT_INCONSISTENCIES, disabled: false },
    { text: 'Estatísticas', icon: <StatsIcon />, path: '/statistics', disabled: true },
    { text: 'Utilizadores', icon: <DonorsIcon />, path: MANAGE_USERS, disabled: false },
    { text: 'Doutores', icon: <DoctorsIcon />, path: '/doctors', disabled: true },
    { text: 'Notificações', icon: <NotificationsIcon />, path: '/notifications', disabled: true },
    { text: 'Definições', icon: <SettingsIcon />, path: '/settings', disabled: true },
  ];

  return (
    <Box sx={{ width: '25%' }}>
      <List>
        {navBuilder(navItems.slice(0, 4), nav, location)}
        <Divider />
        <Typography variant="h6" sx={{ margin: 2, textAlign: 'left' }}>
          Gestão de Utilizadores
        </Typography>
        {navBuilder(navItems.slice(4), nav, location)}
      </List>
    </Box>
  );
}
