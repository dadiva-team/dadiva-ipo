import React, { ReactElement } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Button, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FormIcon from '@mui/icons-material/Description';
import MedicationIcon from '@mui/icons-material/LocalPharmacy';
import StatsIcon from '@mui/icons-material/BarChart';
import DonorsIcon from '@mui/icons-material/People';
import DoctorsIcon from '@mui/icons-material/MedicalServices';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import { useLocation, useNavigate, Location } from 'react-router-dom';
import Typography from '@mui/material/Typography';

interface NavItem {
  text: string;
  icon: ReactElement;
  path: string;
  disabled: boolean;
}

function navBuilder(items: NavItem[], navigate: (path: string) => void, location: Location) {
  return items.map(item => (
    <ListItem key={item.text}>
      <Button disabled={location.pathname === item.path || item.disabled} onClick={() => navigate(item.path)}>
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText primary={item.text} />
      </Button>
    </ListItem>
  ));
}

export function BackofficeNavBar() {
  const location = useLocation();
  const nav = useNavigate();

  const navItems: NavItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/backoffice', disabled: false },
    { text: 'Editar Formulário', icon: <FormIcon />, path: '/backoffice/edit-form', disabled: false },
    { text: 'Editar Medicação', icon: <MedicationIcon />, path: '/edit-medication', disabled: true },
    { text: 'Estatísticas', icon: <StatsIcon />, path: '/statistics', disabled: true },
    { text: 'Dadores', icon: <DonorsIcon />, path: '/donors', disabled: true },
    { text: 'Doutores', icon: <DoctorsIcon />, path: '/doctors', disabled: true },
    { text: 'Notificações', icon: <NotificationsIcon />, path: '/notifications', disabled: true },
    { text: 'Definições', icon: <SettingsIcon />, path: '/settings', disabled: true },
  ];

  return (
    <Box sx={{ width: '25%' }}>
      <List>
        {navBuilder(navItems.slice(0, 4), nav, location)}
        <Divider />
        <Typography variant="h6" sx={{ margin: 2, textAlign: 'center' }}>
          Gestão de Utilizadores
        </Typography>
        {navBuilder(navItems.slice(4), nav, location)}
      </List>
    </Box>
  );
}
