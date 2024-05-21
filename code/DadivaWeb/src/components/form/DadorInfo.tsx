import PersonIcon from '@mui/icons-material/Person';
import React from 'react';
import { Box, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

type UserProps = {
  name: string;
  nic: string;
};
const MyIcon = () => <PersonIcon sx={{ fontSize: 50 }} />;
const DadorInfo = ({ name, nic }: UserProps) => (
  <Paper elevation={2} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
    <MyIcon />
    <Box sx={{ marginLeft: 2 }}>
      <Typography variant="h6" component="div">
        {name}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        NIC: {nic}
      </Typography>
    </Box>
  </Paper>
);

export function UserInfo({ name, nic }: UserProps) {
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
      <DadorInfo name={name} nic={nic} />
    </Box>
  );
}
