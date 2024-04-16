import React, { createContext, useContext, useState } from 'react';

type UserManager = {
  user: string | undefined;
  setUser: (user: string) => void;
  clearUser: () => void;
};
const LoggedInContext = createContext<UserManager>({
  user: undefined,
  setUser: () => {},
  clearUser: () => {},
});

export function AuthnContainer({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | undefined>(undefined);
  console.log(`AuthnContainer: ${user}`);
  return (
    <LoggedInContext.Provider
      value={{
        user: user,
        setUser: user => {
          setUser(user);
          sessionStorage.setItem('user', user);
        },
        clearUser: () => {
          setUser(undefined);
          sessionStorage.removeItem('user');
        },
      }}
    >
      {children}
    </LoggedInContext.Provider>
  );
}

export function useCurrentUser() {
  const context = useContext(LoggedInContext);
  const contextUser = context.user;
  const user = contextUser === undefined ? sessionStorage.getItem('user') : contextUser;
  if (user !== null) context.setUser(user);
  return user;
}

export function useSetUser() {
  return useContext(LoggedInContext).setUser;
}

export function useUserManager() {
  return useContext(LoggedInContext);
}
