import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { SuspensionType, UserSuspensionAccountStatus } from '../services/users/models/LoginOutputModel';
import { SubmitFormOutputModel } from '../services/from/models/SubmitFormOutputModel';

export enum Role {
  DONOR = 'donor',
  DOCTOR = 'doctor',
  ADMIN = 'admin',
}

export interface Session {
  readonly name: string;
  readonly nic: number;
  readonly perms: Role[];
  readonly accountStatus: UserSuspensionAccountStatus;
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
    const userItem = localStorage.getItem('user');
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
        localStorage.setItem('user', JSON.stringify(user));
      },
      clearSession: () => {
        setSession(null);
        localStorage.removeItem('user');
      },
    }),
    [session]
  );

  return <LoggedInContext.Provider value={sessionManager}>{children}</LoggedInContext.Provider>;
}

export function useCurrentSession() {
  const context = useContext(LoggedInContext);
  const contextUser = context.session;
  const userItem = localStorage.getItem('user');

  const user: Session =
    contextUser === null && userItem && userItem !== 'undefined' ? JSON.parse(userItem) : contextUser;

  useEffect(() => {
    if (user !== null && contextUser === null) {
      context.setSession(user);
    }
  }, [user, contextUser, context]);

  return user;
}

export function useSessionManager() {
  return useContext(LoggedInContext);
}

export function useUpdateSessionStatus() {
  const sessionManager = useSessionManager();

  return function (newStatus: SuspensionType, res: SubmitFormOutputModel) {
    const currentUser = sessionManager.session;

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        accountStatus: {
          ...currentUser.accountStatus,
          suspensionIsActive: true,
          suspensionType: newStatus,
          suspensionStartDate: res.submissionDate,
        },
      };

      sessionManager.setSession(updatedUser);
    }
  };
}

export function useAccountStatus() {
  const user = useCurrentSession();
  console.log(`useAccountStatus: ${JSON.stringify(user)}`);
  return user?.accountStatus;
}

export function useLoggedIn() {
  const user = useCurrentSession();
  console.log(`useLoggedIn: ${JSON.stringify(user)}`);
  return user !== null;
}
