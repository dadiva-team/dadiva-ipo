import { Box, List } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import React from 'react';
import { navBuilder, NavItem } from "../../components/shared/NavBuilder";
import Typography from "@mui/material/Typography";
import { Uris } from "../../utils/navigation/Uris";
import DOCTOR_SEARCH_NIC = Uris.DOCTOR_SEARCH_NIC;
import DOCTOR_SEARCH_NAME = Uris.DOCTOR_SEARCH_NAME;

export function DoctorNavBar() {
  const location = useLocation();
  const nav = useNavigate();

  const menuItems: NavItem[] = [
    { text: 'Por nome', icon: <SearchIcon />, path: DOCTOR_SEARCH_NAME, disabled: true },
    { text: 'Por Nic', icon: <SearchIcon />, path: DOCTOR_SEARCH_NIC, disabled: false },
  ];

  return (
    <Box sx={{ width: '15%' }}>
      <Typography variant="h6" sx={{ margin: 2, textAlign: 'center' }}>
        Pesquisa de Dadores
      </Typography>
      <List>{navBuilder(menuItems.slice(0, 2), nav, location)}</List>
    </Box>
  );
}