import PersonIcon from '@mui/icons-material/Person';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import React from 'react';

type UserProps = {
  name: string;
  nic: string;
};
const MyIcon = () => <PersonIcon sx={{ fontSize: 50 }} />;
const DadorInfo = ({ name, nic }: UserProps) => (
  <Card variant="outlined" sx={{ maxWidth: 200, margin: 'auto' }}>
    <CardContent>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        <MyIcon />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6">{name}</Typography>
          <Typography variant="h6">{nic}</Typography>
        </div>
      </div>
    </CardContent>
  </Card>
);

export function UserInfo({ name, nic }: UserProps) {
  return (
    <div
      style={{
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: '20px',
      }}
    >
      <h1>Dador</h1>
      <DadorInfo name={name} nic={nic} />
    </div>
  );
}
