import React from 'react';
import { List, Divider, Box } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import FormIcon from '@mui/icons-material/Description';
import MedicationIcon from '@mui/icons-material/LocalPharmacy';
import StatsIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DonorsIcon from '@mui/icons-material/People';
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
import STATISTICS = Uris.STATISTICS;
import SETTINGS = Uris.SETTINGS;
import { useTranslation } from 'react-i18next';

export function BackofficeNavBar() {
  const { t } = useTranslation();
  const location = useLocation();
  const nav = useNavigate();

  const navItems: NavItem[] = [
    { text: t('Dashboard'), icon: <DashboardIcon />, path: BACKOFFICE, disabled: false },
    { text: t('Edit Form'), icon: <FormIcon />, path: EDIT_FORM, disabled: false },
    { text: t('Edit Terms and Conditions'), icon: <GavelIcon />, path: TERMS_CONDITIONS, disabled: false },
    { text: t('Edit Inconsistencies'), icon: <MedicationIcon />, path: EDIT_INCONSISTENCIES, disabled: false },
    { text: t('Statistics'), icon: <StatsIcon />, path: STATISTICS, disabled: false },
    { text: t('Settings'), icon: <SettingsIcon />, path: SETTINGS, disabled: false },
    { text: t('Manage Users'), icon: <DonorsIcon />, path: MANAGE_USERS, disabled: false },
  ];

  return (
    <Box sx={{ width: '25%' }}>
      <List>
        {navBuilder(navItems.slice(0, 6), nav, location)}
        <Divider />
        <Typography variant="h6" sx={{ margin: 2, textAlign: 'left' }}>
          Gestão de Utilizadores
        </Typography>
        {navBuilder(navItems.slice(6), nav, location)}
      </List>
    </Box>
  );
}
