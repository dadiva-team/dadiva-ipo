import { useLoggedIn, useSessionManager } from '../../session/Session';
import { Container } from '@mui/material';
import { LogoIPO } from './LogoIPO';
import { UserInfo } from '../form/DadorInfo';
import React from 'react';

export function Header() {
  const session = useSessionManager();
  const loggedIn = useLoggedIn();

  return (
    <Container
      sx={{
        p: 1,
        display: 'flex',
        flexDirection: 'row',
        mt: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <LogoIPO />
      {loggedIn ? <UserInfo name={session.session.name} nic={session.session.nic} /> : <> {} </>}
    </Container>
  );
}
