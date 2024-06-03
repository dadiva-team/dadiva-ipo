import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export enum Role {
  DONOR = 'DONOR',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export interface Session {
  readonly name: string;
  readonly nic: number;
  readonly role: Role;
}

type SessionManager = {
  session: Session | null;
  setSession: (user: Session) => void;
  clearSession: () => void;
};
const LoggedInContext = createContext<SessionManager>({
  session: null,
  setSession: () => {},
  clearSession: () => {},
});

export function AuthnContainer({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    const userItem = sessionStorage.getItem('user');
    return userItem && userItem !== 'undefined' ? JSON.parse(userItem) : null;
  });

  const sessionManager = useMemo<SessionManager>(
    () => ({
      session: session,
      setSession: (user: Session) => {
        if (!user) {
          return;
        }
        setSession(user);
        sessionStorage.setItem('user', JSON.stringify(user));
      },
      clearSession: () => {
        setSession(null);
        sessionStorage.removeItem('user');
      },
    }),
    [session]
  );

  return <LoggedInContext.Provider value={sessionManager}>{children}</LoggedInContext.Provider>;
}

export function useCurrentSession() {
  const context = useContext(LoggedInContext);
  const contextUser = context.session;
  const userItem = sessionStorage.getItem('user');

  const user: Session =
    contextUser === null && userItem && userItem !== 'undefined' ? JSON.parse(userItem) : contextUser;

  useEffect(() => {
    if (user !== null && contextUser === null) {
      context.setSession(user);
    }
  }, [user, contextUser, context]);

  return user;
}

export function useSetSession() {
  return useContext(LoggedInContext).setSession;
}

export function useSessionManager() {
  return useContext(LoggedInContext);
}

export function useLoggedIn() {
  const user = useCurrentSession();
  console.log(`useLoggedIn: ${user}`);
  return user !== null;
}
