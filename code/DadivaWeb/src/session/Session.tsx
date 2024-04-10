import React, { createContext, useState } from 'react';

export interface Session {
  name: string;
}

export interface SessionManager {
  readonly session: Session | null;
  readonly setSession: (session: Session) => void;
  readonly clearSession: () => void;
}

const SessionManagerContext = createContext<SessionManager>({
  session: null,
  setSession: () => {},
  clearSession: () => {},
});

export function AuthnContainer({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | undefined>(undefined);
  console.log(`AuthnContainer: ${session}`);
  return (
    <SessionManagerContext.Provider
      value={{
        session,
        setSession: (session: Session) => {
          setSession(session);
          sessionStorage.setItem('session', JSON.stringify(session));
        },
        clearSession: () => {
          setSession(null);
          sessionStorage.removeItem('session');
        },
      }}
    >
      {children}
    </SessionManagerContext.Provider>
  );
}
