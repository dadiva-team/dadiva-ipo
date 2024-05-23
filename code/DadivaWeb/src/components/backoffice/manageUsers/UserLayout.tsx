import { Button, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import DonorsIcon from '@mui/icons-material/People';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

interface UserLayoutProps {
  nic: number;
  onDeleteRequest: (nic: number) => void;
  //onRoleChange: (role: string) => void | null;
  //onPasswordChange: (password: string) => void | null;
  //onUserCreation: (nic: number, password: string) => void | null;
}

export function UserLayout({ nic, onDeleteRequest }: UserLayoutProps) {
  return (
    <ListItem>
      <ListItemIcon>
        <DonorsIcon />
      </ListItemIcon>

      <ListItemText>
        <Typography>{nic}</Typography>
      </ListItemText>

      <Button
        color="warning"
        variant="outlined"
        onClick={() => onDeleteRequest(nic)}
        startIcon={<DeleteIcon />}
        sx={{ borderRadius: 50, height: 40 }}
      >
        Apagar utilizador
      </Button>
    </ListItem>
  );
}
