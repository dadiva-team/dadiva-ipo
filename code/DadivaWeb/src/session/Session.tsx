import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {AccountStatus, UserAccountStatus} from "../services/users/models/LoginOutputModel";
import {SubmitFormOutputModel} from "../services/from/models/SubmitFormOutputModel";

export enum Role {
    DONOR = 'donor',
    DOCTOR = 'doctor',
    ADMIN = 'admin',
}

export interface Session {
    readonly name: string;
    readonly nic: number;
    readonly perms: Role;
    readonly accountStatus: UserAccountStatus;
}

type SessionManager = {
    session: Session | null;
    setSession: (user: Session) => void;
    clearSession: () => void;
};
const LoggedInContext = createContext<SessionManager>({
    session: null,
    setSession: () => {
    },
    clearSession: () => {
    },
});

export function AuthnContainer({children}: { children: React.ReactNode }) {
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

export function useSessionManager() {
    return useContext(LoggedInContext);
}

export function useUpdateSessionStatus() {
    const sessionManager = useSessionManager();

    return function (newStatus: AccountStatus, res: SubmitFormOutputModel) {
        const currentUser = sessionManager.session;

        if (currentUser) {
            const updatedUser = {
                ...currentUser,
                accountStatus: {
                    ...currentUser.accountStatus,
                    lastSubmissionDate: res.submissionDate,
                    lastSubmissionId: res.submissionId,
                    status: newStatus,
                },
            };

            sessionManager.setSession(updatedUser);
        }
    }
}

export function useHasPendingReview() {
    const user = useCurrentSession();
    return user?.accountStatus?.status === AccountStatus.PendingReview;
}

export function useLoggedIn() {
    const user = useCurrentSession();
    console.log(`useLoggedIn: ${JSON.stringify(user)}`);
    return user !== null;
}
