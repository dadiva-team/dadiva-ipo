import { useLoggedIn, useSessionManager } from '../../session/Session';
import { Container } from '@mui/material';
import { LogoIPO } from './LogoIPO';
import { UserInfo } from './DadorInfo';
import React from 'react';
import LanguageSwitcher from '../language/LanguageSwitcher';

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
      <LanguageSwitcher />
      {loggedIn ? (
        <UserInfo name={session.session.name} nic={`${session.session.nic}`} roles={session.session.perms} />
      ) : (
        <> {} </>
      )}
    </Container>
  );
}
